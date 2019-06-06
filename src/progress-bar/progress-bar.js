;
(function () {
  'use strict'
  const progressBody = document.querySelector('.with-progress');
  const triggerHeight = window.innerHeight;

  function checkProgressBody() {
    const bottom = progressBody.getBoundingClientRect().bottom;

    if (bottom < triggerHeight && !progressBody.classList.contains('progress-active')) {
      progressBody.classList.add('progress-active');
      window.removeEventListener('scroll', checkProgressBody,false);
    }
  }

  window.addEventListener('scroll', checkProgressBody,false);
})();
