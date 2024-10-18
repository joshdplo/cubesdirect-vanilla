/**
 * Global Message
 */
const durationDefault = 3500;

export function globalMessage(text, type = 'info', duration = durationDefault) {
  const navEl = document.querySelector('header.nav-main');
  const messageDiv = document.createElement('div');
  messageDiv.className = `global-message ${type}`;
  messageDiv.innerText = text;
  if (type === 'error') messageDiv.setAttribute('aria-role', 'alert');

  navEl.parentNode.insertBefore(messageDiv, navEl);

  setTimeout(() => {
    messageDiv.remove();
  }, duration);
}

// If we have a message from express, just remove it after duration
export function globalMessageOnLoad() {
  const messageEl = document.querySelector('.global-message');
  if (messageEl) setTimeout(() => messageEl.remove(), durationDefault);
}