class LoadingSpinnerModal extends HTMLElement {
  constructor() {
    super();
    this.createLoadingSpinnerModal();
  }
  createLoadingSpinnerModal() {
    this.innerHTML = `
      <style>
        pre {
          opacity: 0;
          animation: appear 0.3s ease forwards;
        }
        pre:nth-child(1) {
          animation-delay: 0.4s;
        }
        pre:nth-child(2) {
          animation-delay: 1.2s;
        }
        pre:nth-child(3) {
          animation-delay: 2.4s;
        }
        @keyframes appear {
          to {
            opacity: 1;
          }
        }
      </style>

      <div
        class="h-screen w-screen fixed inset-0 flex bg-black/80 z-10000000000"
        id="spinningModalContainer"
      >
        <div class="flex flex-col w-full h-full justify-center items-center">
          <div
            class="flex flex-col justify-center w-11/12 sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 mx-auto rounded-lg h-fit"
          >
            <div
              class="mockup-code bg-base-100 text-black w-full flex flex-col justify-center shadow-xl"
            >
              <pre data-prefix="$"><code>npm i find-your-cool</code></pre>
              <pre
                data-prefix=">"
                class="text-black"
              ><code>installing resources...</code></pre>
              <pre
                data-prefix=">"
                class="bg-success text-success-content"
              ><code>Done!</code></pre>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("loading-spinner-modal", LoadingSpinnerModal);
