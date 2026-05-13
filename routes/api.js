// import all dependencies
const express = require("express");
const { formsModel, userModel, formulaModel } = require("../mongodbAtlas");

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";
const NEIGHBORHOOD_DATA_URL =
  "https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/local-area-boundary/records?limit=100";

const RELEVANCE_KEYWORDS = [
  "heat",
  "hot",
  "temperature",
  "cool",
  "cooling",
  "shade",
  "tree",
  "trees",
  "canopy",
  "water",
  "fountain",
  "washroom",
  "restroom",
  "toilet",
  "bathroom",
  "community centre",
  "community center",
  "cooling centre",
  "cooling center",
  "park",
  "parks",
  "respite",
];

const REPORT_TOPIC_DEFINITIONS = [
  {
    label: "temperature and heat",
    keywords: ["heat", "hot", "temperature", "hotter", "heatwave"],
  },
  {
    label: "shade and tree cover",
    keywords: ["shade", "shaded", "tree", "trees", "canopy", "tree cover"],
  },
  {
    label: "water access",
    keywords: ["water", "fountain", "hydration", "drink", "refill", "thirsty"],
  },
  {
    label: "public washrooms",
    keywords: [
      "washroom",
      "washrooms",
      "restroom",
      "restrooms",
      "toilet",
      "bathroom",
    ],
  },
  {
    label: "cooling spaces",
    keywords: [
      "cooling centre",
      "cooling center",
      "cool centre",
      "cool center",
      "community centre",
      "community center",
      "cooling",
      "park",
      "parks",
      "respite",
    ],
  },
  {
    label: "infrastructure improvements",
    keywords: [
      "improve",
      "more",
      "need",
      "add",
      "install",
      "replace",
      "upgrade",
    ],
  },
];

let neighborhoodCache = null;

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function isRelevantReport(report) {
  const text = normalizeText(
    [report?.formText, report?.address, report?.username].join(" "),
  );
  return RELEVANCE_KEYWORDS.some((keyword) => text.includes(keyword));
}

function pointInRing(point, ring) {
  let inside = false;

  for (
    let current = 0, previous = ring.length - 1;
    current < ring.length;
    previous = current++
  ) {
    const [currentLng, currentLat] = ring[current];
    const [previousLng, previousLat] = ring[previous];
    const crosses =
      currentLat > point[1] !== previousLat > point[1] &&
      point[0] <
        ((previousLng - currentLng) * (point[1] - currentLat)) /
          (previousLat - currentLat || Number.EPSILON) +
          currentLng;

    if (crosses) {
      inside = !inside;
    }
  }

  return inside;
}

function pointInGeometry(point, geometry) {
  if (!geometry || !geometry.type || !geometry.coordinates) {
    return false;
  }

  if (geometry.type === "Polygon") {
    return pointInRing(point, geometry.coordinates[0] || []);
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((polygon) =>
      pointInRing(point, polygon[0] || []),
    );
  }

  return false;
}

function extractNeighborhood(entry) {
  const geometry =
    entry?.geom?.geometry || entry?.geom || entry?.geometry || null;
  const name =
    entry?.name ||
    entry?.local_area ||
    entry?.neighborhood ||
    entry?.neighbourhood ||
    entry?.area_name;

  if (!name || !geometry) {
    return null;
  }

  return { name, geometry };
}

async function getNeighborhoodBoundaries() {
  if (neighborhoodCache) {
    return neighborhoodCache;
  }

  const response = await fetch(NEIGHBORHOOD_DATA_URL);
  const data = await response.json();
  neighborhoodCache = (data.results || [])
    .map(extractNeighborhood)
    .filter(Boolean);

  return neighborhoodCache;
}

function getNeighborhoodForReport(report, neighborhoods) {
  const point = [Number(report?.lng), Number(report?.lat)];

  if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) {
    return "Unknown";
  }

  for (const neighborhood of neighborhoods) {
    if (pointInGeometry(point, neighborhood.geometry)) {
      return neighborhood.name;
    }
  }

  return "Unknown";
}

function getMatchedTopics(report) {
  const text = normalizeText([report?.formText, report?.address].join(" "));
  const matches = [];

  for (const topic of REPORT_TOPIC_DEFINITIONS) {
    if (topic.keywords.some((keyword) => text.includes(keyword))) {
      matches.push(topic.label);
    }
  }

  return matches;
}

function buildFallbackSummary(reports, scopeLabel, neighborhoodName) {
  const topicCounts = new Map();
  const neighborhoodCounts = new Map();

  for (const report of reports) {
    const topics = getMatchedTopics(report);
    for (const topic of topics) {
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    }

    neighborhoodCounts.set(
      report.neighborhood,
      (neighborhoodCounts.get(report.neighborhood) || 0) + 1,
    );
  }

  const topTopics = [...topicCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3);
  const topNeighborhoods = [...neighborhoodCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([name, count]) => `${name} (${count})`);

  const topicText = topTopics.length
    ? topTopics.map(([topic]) => topic).join(", ")
    : "heat-related infrastructure";
  const scopeTarget = neighborhoodName || "Vancouver";

  return {
    overview: reports.length
      ? `${scopeLabel} summary for ${scopeTarget} is dominated by ${topicText}.`
      : `No relevant heat-infrastructure reports were found for ${scopeTarget}.`,
    highlights: reports.length
      ? [
          `Reviewed ${reports.length} relevant report${reports.length === 1 ? "" : "s"}.`,
          topTopics.length
            ? `Most common themes: ${topTopics.map(([topic]) => topic).join(", ")}.`
            : "Reports were relevant to heat and cooling infrastructure, but not clustered around a single theme.",
          topNeighborhoods.length
            ? `Most active neighbourhoods: ${topNeighborhoods.join(", ")}.`
            : "Neighbourhood assignment could not be determined for these reports.",
        ]
      : ["No relevant reports matched the current filter."],
    recommendedActions: reports.length
      ? [
          "Prioritize fixes where residents repeatedly mention heat, shade, and cooling access.",
          "Check the most-mentioned locations for missing trees, water access, washrooms, or cooling spaces.",
          "Use neighbourhood-level counts to decide where to add or upgrade cooling infrastructure first.",
        ]
      : [
          "No action items generated because no relevant reports matched the filter.",
        ],
    topTopics: topTopics.map(([topic]) => topic),
    topNeighborhoods,
  };
}

async function summarizeWithAI(payload) {
  if (!CLAUDE_API_KEY) {
    return "Claude API Key bad";
    // return null;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      temperature: 0.2,
      max_tokens: 1200,
      system:
        "You summarize City of Vancouver heat and cooling infrastructure reports. Only use the reports provided. Ignore unrelated reports. Return valid JSON only with the keys overview, highlights, recommendedActions, topTopics, and topNeighborhoods. Each array should contain short strings.",
      messages: [
        {
          role: "user",
          content: JSON.stringify(payload, null, 2),
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  const content = (json?.content || [])
    .filter((block) => block?.type === "text")
    .map((block) => block.text)
    .join("\n");

  if (!content) {
    return null;
  }

  const parseMaybeJson = (text) => {
    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  };

  const stripCodeFence = (text) => {
    const fencedMatch = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return fencedMatch ? fencedMatch[1].trim() : text;
  };

  const parseSummaryObject = (text) => {
    const cleaned = stripCodeFence(String(text || "").trim());

    // 1) Direct JSON parse
    let parsed = parseMaybeJson(cleaned);

    // 2) If the full payload has extra text, parse the first JSON object slice
    if (!parsed) {
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        parsed = parseMaybeJson(cleaned.slice(firstBrace, lastBrace + 1));
      }
    }

    // 3) If model returned a JSON string, parse again (may be fenced)
    if (typeof parsed === "string") {
      parsed = parseMaybeJson(stripCodeFence(parsed.trim()));
    }

    // 4) If wrapped in { summary: "..." }, unwrap summary
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      typeof parsed.summary === "string"
    ) {
      const summaryParsed = parseMaybeJson(
        stripCodeFence(parsed.summary.trim()),
      );
      if (summaryParsed && typeof summaryParsed === "object") {
        parsed = summaryParsed;
      }
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    const hasRequiredShape =
      typeof parsed.overview === "string" &&
      Array.isArray(parsed.highlights) &&
      Array.isArray(parsed.recommendedActions) &&
      Array.isArray(parsed.topTopics) &&
      Array.isArray(parsed.topNeighborhoods);

    return hasRequiredShape ? parsed : null;
  };

  try {
    return parseSummaryObject(content);
  } catch (error) {
    return null;
  }
}

async function buildReportSummary({ scope, neighborhoodName }) {
  const allReports = await formsModel.find({}).lean();
  const neighborhoods = await getNeighborhoodBoundaries();
  const reportsWithNeighborhoods = allReports.map((report) => ({
    ...report,
    neighborhood: getNeighborhoodForReport(report, neighborhoods),
  }));

  const relevantReports = reportsWithNeighborhoods.filter(isRelevantReport);
  const scopedReports =
    scope === "neighborhood" && neighborhoodName
      ? relevantReports.filter(
          (report) => report.neighborhood === neighborhoodName,
        )
      : relevantReports;

  const summaryInput = {
    scope,
    neighborhoodName: neighborhoodName || null,
    totalReports: allReports.length,
    relevantReports: scopedReports.map((report) => ({
      username: report.username,
      address: report.address,
      formText: report.formText,
      neighborhood: report.neighborhood,
    })),
    neighborhoodCounts: Object.fromEntries(
      relevantReports.reduce((counts, report) => {
        counts.set(
          report.neighborhood,
          (counts.get(report.neighborhood) || 0) + 1,
        );
        return counts;
      }, new Map()),
    ),
  };

  const aiSummary = await summarizeWithAI(summaryInput);
  const summary =
    aiSummary ||
    buildFallbackSummary(
      scopedReports,
      scope === "neighborhood" ? "Neighbourhood" : "Citywide",
      neighborhoodName,
    );

  return {
    scope,
    neighborhood: neighborhoodName || null,
    totalReportCount: allReports.length,
    relevantReportCount: scopedReports.length,
    ignoredReportCount: allReports.length - relevantReports.length,
    summary,
  };
}

// create instance of express (but with the .Router() method)
const router = express.Router();

router.get("/fountains", async (req, res) => {
  try {
    const limit = 100;
    let offset = 0;
    const fountainData = [];

    while (true) {
      const result = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/drinking-fountains/records?limit=${limit}&offset=${offset}`,
      );

      const resultJSON = await result.json();

      for (let i = 0; i < resultJSON.results.length; i++) {
        fountainData.push(resultJSON.results[i]);
      }

      if (resultJSON.results.length < limit) {
        break;
      }

      offset += limit;
    }

    res.json(fountainData);
  } catch (error) {
    console.log("Error fetching fountains:", error);
    res.status(500).json({ error: "Failed to fetch fountains" });
  }
});

router.get("/washrooms", async (req, res) => {
  try {
    const limit = 100;
    let offset = 0;
    const washroomData = [];

    while (true) {
      const result = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-washrooms/records?limit=${limit}&offset=${offset}`,
      );

      const resultJSON = await result.json();

      for (let i = 0; i < resultJSON.results.length; i++) {
        washroomData.push(resultJSON.results[i]);
      }

      if (resultJSON.results.length < limit) {
        break;
      }

      offset += limit;
    }

    res.json(washroomData);
  } catch (error) {
    console.log("Error fetching washrooms:", error);
    res.status(500).json({ error: "Failed to fetch washrooms" });
  }
});

// fetch current weather data
router.get("/", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  res.json(data);
});

// fetch shade key for shade api
router.get("/key", async (req, res) => {
  res.json({ key: process.env.SHADE_API });
});

// fetch community centres data
router.get("/community-centres", async (req, res) => {
  try {
    const limit = 100;
    let offset = 0;
    const communityCentresData = [];

    while (true) {
      const result = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/community-centres/records?limit=${limit}&offset=${offset}`,
      );

      const resultJSON = await result.json();

      for (let i = 0; i < resultJSON.results.length; i++) {
        communityCentresData.push(resultJSON.results[i]);
      }

      if (resultJSON.results.length < limit) {
        break;
      }

      offset += limit;
    }

    res.json(communityCentresData);
  } catch (error) {
    console.log("Error fetching community centres:", error);
    res.status(500).json({ error: "Failed to fetch community centres" });
  }
});

/**
 * Route for fetching a filtered subset of public trees within the City of Vancouver.
 *
 * DISCLAIMER: This route intentionally limits the dataset to tree families that
 * provide good canopy coverage. As loading all ~180,000 public trees would result
 * in performance issues.
 *
 * A tree that satisfies this criteria is if they belong to a specific family of trees,
 * have a height >= 6m and diameter >= 20cm
 *
 * Reference: Claude used to determine family of trees that provide sufficient canopy coverage
 * Reference: Huwise/OpenDataSoft used to construct filtered queries and geo_cluster feature (https://help.opendatasoft.com/apis/ods-explore-v2/#section/Introduction)
 */
router.get("/public-trees", async (req, res) => {
  // Structured with quotations to make ODSQL query work
  const SPECIES_OF_TREES_WITH_CANOPY_COVERAGE = [
    '"ACER"',
    '"QUERCUS"',
    '"TILIA"',
    '"PLATANUS"',
    '"FRAXINUS"',
    '"ULMUS"',
    '"FAGUS"',
    '"CASTANEA"',
    '"AESCULUS"',
    '"ROBINIA"',
    '"LIRIODENDRON"',
    '"LIQUIDAMBAR"',
    '"CARPINUS"',
  ];

  // A request to this endpoint must include a zoom level and radius
  const zoom = Math.min(parseInt(req.query.zoom) || 13, 18); // the zoom level (fetched using map.getZoom() ), 18 is the max limit for leaflet at block-level view
  const isStreetLevel = zoom == 18;
  const radius = isStreetLevel ? 5 : Math.max(80 - zoom * 4, 30); // the max cluster radius size: the smaller the more markers, shrinks as zoom increases, floor of 20

  // Bounding box - only returns results from the passed bbox (best practice: should return the map's bounds / viewport screen) default to Vancouver
  const bbox = req.query.bbox || "49.20,-123.22,49.36,-122.98";
  const [south, west, north, east] = bbox.split(","); // unpack

  // Filter trees that are:
  const where = [
    `in_bbox(geo_point_2d, ${south}, ${west}, ${north}, ${east})`, // (1) Inside the given bounding box
    `height_m >= 6`, // (2) Tree height >= 6m
    `diameter_cm >= 20`, // (3) Trunk diameter >= to 20cm
    `genus_name in (${SPECIES_OF_TREES_WITH_CANOPY_COVERAGE.join(", ")})`, // (4) Part of the aforementioned species of trees
  ].join(" AND ");

  const queryParams = new URLSearchParams({
    group_by: `geo_cluster(geo_point_2d, ${zoom}, ${radius})`, // sets the search to a geo_cluster search
    select: "count(*) as count", // gets the number of trees within a given cluster
    where, // filter logic
    limit: 100,
  });

  const url = `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-trees/records?${queryParams}`; // Base API call + additional params for filtering and geo clustering

  const result = await fetch(url);
  const resultJSON = await result.json();
  res.send(resultJSON);
});

/**
 * Fetch raw parks data from opendata.vancouver.ca
 * Limited to 100 results for each call, continues calling using offset until all parks fetched
 * @returns {Array} Raw parks data from opendata.vancouver.ca
 */
router.get("/parks", async (req, res) => {
  try {
    const parksData = [];
    const limit = 100;
    let offset = 0;

    while (true) {
      const results = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/parks-polygon-representation/records?limit=${limit}&offset=${offset}`,
      );
      const resultsJSON = await results.json();

      for (let i = 0; i < resultsJSON.results.length; i++) {
        parksData.push(resultsJSON.results[i]);
      }

      if (resultsJSON.results.length < limit) {
        break;
      }

      offset += limit;
    }
    res.json(parksData);
  } catch (error) {
    console.log("Error fetching parks:", error);
    res.status(500).json({ error: "Failed to fetch parks" });
  }
});

router.get("/user", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

router.get("/deleteAccount/:user", async (req, res) => {
  try {
    const deletedAccount = await userModel.findOneAndDelete({
      username: req.params.user,
    });

    res.json(deletedAccount);
  } catch (error) {
    console.log(error);
    res.status(403).send("Error deleting account");
  }
});

router.post("/reports", async (req, res) => {
  if (!req.session.user) {
    return res
      .status(401)
      .json({ error: "You must be logged in to submit a report" });
  }

  try {
    const { lat, lng, address, formText } = req.body;
    const newReport = new formsModel({
      username: req.session.user.username,
      lat,
      lng,
      address,
      formText,
    });
    await newReport.save();
    res.json({ success: true });
  } catch (error) {
    console.log("Error saving report:", error);
    res.status(500).json({ error: "Failed to save report" });
  }
});

router.get("/reports", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      error: "You must be logged in to view reports",
    });
  }

  try {
    let reports;

    if (req.session.user.role === "planner") {
      // planners/admins see all reports
      reports = await formsModel.find({});
    } else {
      // regular users only see their own reports
      reports = await formsModel.find({
        username: req.session.user.username,
      });
    }

    res.json(reports);
  } catch (error) {
    console.log("Error fetching reports:", error);
    res.status(500).json({
      error: "Failed to fetch reports",
    });
  }
});

router.get("/reports/summary", async (req, res) => {
  if (!req.session.user || req.session.user.role !== "planner") {
    return res.status(403).json({
      error: "Only city employees can view the summary",
    });
  }

  try {
    const scope = req.query.scope === "neighborhood" ? "neighborhood" : "all";
    const neighborhoodQuery =
      typeof req.query.neighbourhood === "string"
        ? req.query.neighbourhood
        : req.query.neighborhood;

    const neighborhoodName =
      scope === "neighborhood" && typeof neighborhoodQuery === "string"
        ? neighborhoodQuery.trim()
        : null;

    const summary = await buildReportSummary({ scope, neighborhoodName });
    res.json(summary);
  } catch (error) {
    console.log("Error generating summary:", error);
    res.status(500).json({
      error: "Failed to generate report summary",
    });
  }
});

router.get("/neighborhoods", async (req, res) => {
  try {
    const results = await fetch(NEIGHBORHOOD_DATA_URL);
    const resultsJSON = await results.json();

    res.json(resultsJSON);
  } catch (error) {
    console.log("Error fetching parks:", error);
    res.status(500).json({ error: "Failed to fetch parks" });
  }
});

router.get("/heatScoreFormula", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json();
  }

  try {
    let formula;
    formula = await formulaModel.findOne({
      username: req.session.user.username,
    });
    res.json(formula);
  } catch (error) {
    console.log("Error fetching formula:", error);
    res.status(500).json({
      error: "Failed to fetch formula",
    });
  }
});

module.exports = router;
