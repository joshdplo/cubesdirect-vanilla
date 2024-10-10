require('dotenv').config();
const path = require('path');
const fs = require('fs/promises');
const mongoose = require('mongoose');
const Category = require('../models/Category');

const join = (p) => path.join(__dirname, p);

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cubemart');

// Categories
async function writeCategories() {
  const categories = await Category.find();
  await fs.writeFile(join('../data/categories.json'), JSON.stringify(categories));

  console.log('-> Wrote Categories');
}

// Write Data
async function writeData() {
  console.log('Writing Data...')

  await writeCategories();

  mongoose.connection.close();
}

writeData().catch((err) => console.error(err));