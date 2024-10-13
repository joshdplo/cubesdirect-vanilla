require('dotenv').config();
const path = require('path');
const fs = require('fs/promises');
const sequelize = require('../config/db');
const Category = require('../models/Category');

const join = (p) => path.join(__dirname, p);

// Categories
async function writeCategories() {
  try {
    const categories = await Category.findAll();
    await fs.writeFile(join('../data/categories.json'), JSON.stringify(categories));
  } catch (error) {
    console.error(error);
  }

  console.log('-> Wrote Categories');
}

// Write Data
async function writeData() {
  console.log('Writing Data...');
  try {
    await writeCategories();
  } catch (error) {
    console.error(error);
  } finally {
    sequelize.close();
  }
};

// Run
writeData().catch((err) => console.error(err));