import { v4 as uuidv4 } from 'uuid';

// Get or Create guest cart tokens
export const getOrCreateCartToken = () => {
  let token = localStorage.getItem('guestCartToken');
  if (!token) {
    token = uuidv4();
    localStorage.setItem('guestCartToken', token);
  }

  return token;
}