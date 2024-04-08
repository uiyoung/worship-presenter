const settingsBtn = document.querySelector('#settings-btn');
const filenameInput = document.querySelector('#modal-filename');

const settingsModal = new bootstrap.Modal(
  document.querySelector('#settingsModal')
);

settingsBtn.addEventListener('click', (e) => {
  // if (selectedList.length <= 0) {
  //   alert('아이템을 먼저 선택해 주세요.');
  //   return;
  // }

  // set filename
  const today = getCurrentDate();
  filenameInput.value = `${today}_worship`;

  settingsModal.show();
});

// get current date(yyyy-mm-dd)
function getCurrentDate() {
  const today = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(today);
}
