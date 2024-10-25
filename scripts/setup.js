import fs from 'node:fs/promises';
import { resolve } from '../util/pathUtils.js';

if (process.env.NODE_ENV === 'production') return;

// Copy .env.example to .env if no .env file exists
async function copyEnvFile() {
  try {
    const envFile = resolve('../.env');
    const exampleEnvFile = resolve('../.env.example');

    console.log('Copying .env.example to .env...');
    await fs.copyFile(exampleEnvFile, envFile, fs.constants.COPYFILE_EXCL);
    console.log('.env file successfully created.');
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log('.env file already exists - using existing file.');
    } else {
      console.error(error);
    }
  }
}

copyEnvFile();