(function () {
  var mascotId = 'live2d-mascot';

  function mountMascot() {
    if (document.getElementById(mascotId)) return;

    var button = document.createElement('button');
    button.id = mascotId;
    button.type = 'button';
    button.setAttribute('aria-label', 'Site mascot');
    button.title = 'Hi';

    document.body.appendChild(button);

    button.addEventListener('click', function () {
      button.classList.remove('is-poked');
      void button.offsetWidth;
      button.classList.add('is-poked');
    });

    button.addEventListener('animationend', function (event) {
      if (event.animationName === 'live2d-mascot-poke') {
        button.classList.remove('is-poked');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountMascot, { once: true });
  } else {
    mountMascot();
  }

  document.addEventListener('pjax:complete', mountMascot);
})();
