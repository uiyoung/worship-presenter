const loginForm = document.querySelector('#loginForm');
const emailInput = document.querySelector('#email');
const rememberMeCheckbox = document.querySelector('#remember-me');

loginForm.addEventListener('submit', function (event) {
  if (rememberMeCheckbox.checked) {
    localStorage.setItem('rememberId', emailInput.value);
  } else {
    localStorage.removeItem('rememberId');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const rememberId = localStorage.getItem('rememberId');
  if (rememberId) {
    emailInput.value = rememberId;
    rememberMeCheckbox.checked = true;
  }
});
