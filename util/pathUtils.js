import { fileURLToPath } from 'url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// helper functions
export const join = (str) => path.join(__dirname, str);
export const resolve = (str) => path.resolve(__dirname, str);