const logoutBtn = document.querySelector('#logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      const result = await response.json();
      if (result.success) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
      alert('logout error');
      window.location.href = '/';
    }
  });
}
