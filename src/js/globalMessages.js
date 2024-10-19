/**
 * Global Messages
 */
const globalMessagesContainerId = 'global-messages';
const durationDefault = 3500;

export const showMessage = (text, type = 'info', duration = durationDefault) => {
  const messageContainer = document.getElementById(globalMessagesContainerId);
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
  window._UTIL.showMessage = showMessage;
} else {
  console.log('window._UTIL is not available to add globalMessages.js');
}