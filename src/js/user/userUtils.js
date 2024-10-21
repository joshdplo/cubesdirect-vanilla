export function getUserDataFromPage() {
  const dataEl = document.querySelector('div[data-user]');
  return dataEl ? JSON.parse(dataEl.getAttribute('data-user')) : null;
}