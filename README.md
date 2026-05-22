# Find Your Cool

[**Find Your Cool**](https://find-your-cool.onrender.com/home) is an interactive web application that helps residents locate nearby cooling resources and helps city planners identify heat-vulnerable neighbourhoods in Vancouver

## Features

### Cool Score

Toggle the Score map filter to view the relative Cool Score of each Vancouver neighbourhood.

The Cool Score takes into account all water fountains, public washrooms, parks, community centres, and transit stops in each neighbourhood and weighs them according to the user-controlled sliders.

Cool Score Formula: ∑ ((count ÷ max) × weight)

Adjust the formula by accessing the Cool Score from the user menu in the top right of the screen.

### Map Filters

Source: [City of Vancouver Open Data Portal](https://opendata.vancouver.ca/pages/home/)

- Trees
- Parks
- Community centres
- Public washrooms
- Transit stops
- Water fountains
- User reports

### User Reports

Logged in users can submit a community report anywhere on the map. All reports are viewable by City Planner accounts.

### Live Temperature

Live weather for any location via [OpenWeather](https://openweathermap.org/). Click anywhere on the map to update the temperature.

### AI Report Summary

City planner accounts can open the AI Summary panel to generate a citywide or neighbourhood-level overview of heat-related reports. If `CLAUDE_API_KEY` is configured, the backend uses it for model-generated summaries; otherwise it falls back to a local heuristic summary.

## Project Structure

```md
├── mongodbAtlas.js
├── nodemon.json
├── package.json
├── package-lock.json
├── public
│   ├── components
│   │   ├── loading-spinner.js
│   │   ├── site-navbar.js
│   │   ├── site-profile.js
│   │   ├── speed-dial.js
│   │   └── temperature-container.js
│   ├── css
│   │   └── index.css
│   ├── data
│   │   └── stops.geojson
│   ├── images
│   │   ├── background-vancouver-backdrop.avif
│   │   └── background-vancouver-backdrop.jpg
│   ├── index.html
│   ├── js
│   │   ├── communityCentres.js
│   │   ├── login.js
│   │   ├── mapInit.js
│   │   ├── map.js
│   │   ├── parks.js
│   │   ├── report.js
│   │   ├── score.js
│   │   ├── summaryAI.js
│   │   ├── transit.js
│   │   ├── trees.js
│   │   ├── washroom.js
│   │   └── water.js
│   └── login.html
├── README.md
├── routes
│   ├── achievement.js
│   ├── api.js
│   ├── auth.js
│   └── index.js
├── server.js
└── tailwind.config.js
```

## Tech Stack

- [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Leaflet](https://leafletjs.com/)
- [Leaflet Shadow Simulator](https://www.npmjs.com/package/leaflet-shadow-simulator)
- [Tailwind](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Turf.js](https://turfjs.org/)
- [Node](https://nodejs.org/en)
- [Express](https://expressjs.com/en/)
- [MongoDB](https://www.mongodb.com/)
- [Claude API](https://platform.claude.com/docs/en/api/overview)

## Contributors

### BCIT COMP 2800 2026 - Team DTC-02

- [Luka Gajic](https://github.com/lukagajic1)
- [James Garcia](https://github.com/jgarcia-programs)
- [Bill Hodges](https://github.com/b-hsy)
- [Sam Mynott](https://github.com/sjmy)
- [Fawaz Shariff](https://github.com/Chungywungy)
