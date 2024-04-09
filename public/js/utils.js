// get current date(yyyy-mm-dd)
function getCurrentDate() {
  const today = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(today);
}
