'use strict';

;
(function () {
  'use strict';

  var progressBody = document.querySelector('.with-progress');
  var triggerHeight = window.innerHeight;

  function checkProgressBody() {
    var bottom = progressBody.getBoundingClientRect().bottom;

    if (bottom < triggerHeight && !progressBody.classList.contains('progress-active')) {
      progressBody.classList.add('progress-active');
      window.removeEventListener('scroll', checkProgressBody, false);
    }
  }

  window.addEventListener('scroll', checkProgressBody, false);
})();