document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogoutBtnClick);
  }
});

async function handleLogoutBtnClick() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Logout failed');
    }
  } catch (error) {
    console.error(error);
    alert('logout error');
  } finally {
    window.location.href = '/';
  }
}
