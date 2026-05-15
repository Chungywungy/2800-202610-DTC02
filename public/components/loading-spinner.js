class LoadingSpinnerModal extends HTMLElement {
  constructor() {
    super();
    this.createLoadingSpinnerModal();
  }
  createLoadingSpinnerModal() {
    this.innerHTML = `
      <style>
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .chat-start .chat-bubble {
          animation: slideInLeft 0.3s ease-out both;
        }
        .chat-end .chat-bubble {
          animation: slideInRight 0.3s ease-out both;
          animation-delay: 0.8s;
          opacity: 0;
        }
      </style>
  <div class="h-screen w-screen fixed inset-0 flex bg-black/80 z-10000000000 hidden" id="spinningModalContainer">
    <div class="flex flex-col w-full h-full justify-center align-center">
      <div
        class="flex flex-col justify-center max-w-3xl mx-auto rounded-lg shadow-xl h-fit"
      >
        <dotlottie-wc
          src="https://lottie.host/8f1d5bbc-484f-4ec2-93c9-83687e77b860/bVYGFFpqek.lottie"
          style="width: 300px; height: 300px"
          class="flex self-center"
          autoplay
          loop
        ></dotlottie-wc>
        <div class="chat chat-start">
          <div class="chat-bubble">What's taking so long?</div>
        </div>
        <div class="chat chat-end">
          <div class="chat-bubble">
            Sorry about that! <br />
            We're just loading our resources
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
  }
}

customElements.define("loading-spinner-modal", LoadingSpinnerModal);
my_modal_3.showModal();
