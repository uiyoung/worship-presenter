const tabButtons = document.querySelectorAll('button[data-bs-toggle="pill"]');
tabButtons.forEach((el) => {
  el.addEventListener('shown.bs.tab', (e) => {
    const target = e.target.getAttribute('data-bs-target');
    switch (target) {
      case '#pills-lyrics':
        initLyrics();
        break;
      case '#pills-hymn':
        initHymn();
        break;
      case '#pills-bible':
        initBible();
        break;
      case '#pills-responsive-reading':
        initResponsiveReading();
        break;
      default:
        break;
    }
  });
});

tabButtons[0].dispatchEvent(new Event('shown.bs.tab'));
