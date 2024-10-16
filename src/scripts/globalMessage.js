/**
 * Global Message
 */
export default function globalMessage(message, isError) {
  if (!message) return console.warn('no message sent to globalMessage');
  const el = document.querySelector('#global-message');
  el.innerText = message;
  el.style.color = isError ? 'red' : 'green';
  el.classList.add('active');
  if (isError) el.setAttribute('aria-role', 'alert');
  setTimeout(() => {
    el.classList.remove('active');
    el.removeAttribute('aria-role');
  }, 4000);
}