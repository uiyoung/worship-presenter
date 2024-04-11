// const triggerTabList = document.querySelectorAll('#contents-tab button');
// triggerTabList.forEach((triggerEl) => {
//   const tabTrigger = new bootstrap.Tab(triggerEl);

//   triggerEl.addEventListener('click', (e) => {
//     e.preventDefault();
//     // console.log('yoyo1', triggerEl);
//     console.log('yoyo1', triggerEl.getAttribute('data-bs-target'));

//     // switch (key) {
//     //   case value:
//     //     break;

//     //   default:
//     //     break;
//     // }

//     tabTrigger.show();
//   });
// });

const tabButtons = document.querySelectorAll('button[data-bs-toggle="pill"]');
tabButtons.forEach((el) => {
  el.addEventListener('shown.bs.tab', (e) => {
    // console.log('yoyoyo', e.target, e.relatedTarget);
    // console.log('yoyo1', e.target.getAttribute('data-bs-target'));
    const target = e.target.getAttribute('data-bs-target');
    switch (target) {
      case '#pills-lyrics':
        initLyrics();
        break;

      default:
        break;
    }
  });
});

tabButtons[0].dispatchEvent(new Event('shown.bs.tab'));
