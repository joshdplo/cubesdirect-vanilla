require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cubemart');

/**
 * Users not showing up in mongodb compass due to permissions
 * https://stackoverflow.com/questions/62087007/mongodb-compass-community-databases-are-visible-but-their-collections-are-not-s
 */

async function testUsers() {
  const users = await User.find();

  console.log(users);
}

async function testDB() {
  console.log('TEST START');
  console.log('----------');

  await testUsers();

  mongoose.connection.close();

  console.log('----------');
  console.log('TEST DONE');
}

testDB().catch((err) => console.error(err));