document.addEventListener('DOMContentLoaded', (event) => {
  const mainAndLivechat = document.getElementById('mainAndLivechat');
  const livechat = document.getElementById('livechat');

  function updateGap() {
    if (livechat && livechat.clientWidth > 0) { // Check if the livechat div has a width greater than 0
      mainAndLivechat.classList.add('has-visible-livechat');
    } else {
      mainAndLivechat.classList.remove('has-visible-livechat');
    }
  }

  // Initial check
  updateGap();

  // Optional: Add a resize observer to handle dynamic changes
  const resizeObserver = new ResizeObserver(updateGap);
  resizeObserver.observe(livechat);
});
