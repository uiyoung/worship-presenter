import { initLyrics } from './lyrics.js';
import { initHymn } from './hymn.js';
import { initBible } from './bible.js';
import { initResponsiveReading } from './responsive-reading.js';
import { renderSetlist } from './set-list.js';

const initMap = {
  '#pills-lyrics': initLyrics,
  '#pills-hymn': initHymn,
  '#pills-bible': initBible,
  '#pills-responsive-reading': initResponsiveReading,
};

const tabButtons = document.querySelectorAll('button[data-bs-toggle="pill"]');
tabButtons.forEach((el) => {
  el.addEventListener('shown.bs.tab', (e) => {
    const target = e.target.getAttribute('data-bs-target');
    initMap[target]?.();
  });
});

const firstTab = tabButtons[0];
bootstrap.Tab.getOrCreateInstance(firstTab).show();

renderSetlist();
