/**
 * Global Messages
 */
const messageContainer = document.getElementById('global-messages');
const durationDefault = 3500;

export const showGlobalMessage = (text, type = 'info', duration = durationDefault) => {
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.innerText = text;

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => message.remove());
  message.appendChild(closeButton);

  messageContainer.appendChild(message);

  // Auto-remove after duration
  setTimeout(() => message.remove(), duration);
}

if (window._UTIL) {
  window._UTIL.showGlobalMessage = showGlobalMessage;
} else {
  console.log('window._UTIL is not available to add globalMessages');
}