require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Connect to Mongo
// @TODO investigate deprecation warnings if needed
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cubemart');

async function seedUsers() {
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({
      email: faker.internet.email(),
      password: faker.internet.password(),
      isVerified: faker.datatype.boolean(),
      roles: ['user'],
      addresses: [
        {
          name: faker.animal.bird(),
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode(),
          country: faker.location.country(),
          phone: faker.phone.number({ style: 'international' }),
        }
      ]
    });
  }

  await User.insertMany(users);
  console.log('-> Seeded Users');
}

async function seedCategories() {
  const categories = ['Classic', 'Deluxe', 'Nature', 'Fashion', 'Seasonal', 'International', 'Pop'].map((category) => ({
    name: category,
    description: faker.lorem.sentence()
  }));

  await Category.insertMany(categories);
  console.log('-> Seeded Categories');
}

async function seedProducts() {
  const categories = await Category.find();
  const products = [];

  for (let i = 0; i < 50; i++) {
    const productName = `${faker.commerce.productName()} Cube`;
    products.push({
      name: productName,
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      stock: faker.number.int({ min: 0, max: 100 }),
      category: faker.helpers.arrayElement(categories)._id,
      images: [faker.image.urlPicsumPhotos()],
    });
  }

  await Product.insertMany(products);
  console.log('-> Seeded Products');
}

async function seedReviews() {
  const users = await User.find();
  const products = await Product.find();
  const reviews = [];

  for (let i = 0; i < 30; i++) {
    reviews.push({
      user: faker.helpers.arrayElement(users)._id,
      product: faker.helpers.arrayElement(products)._id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence()
    });
  }

  await Review.insertMany(reviews);
  console.log('-> Seeded Reviews');
}

async function seedAll() {
  console.log('Starting Database Seeding...');

  await mongoose.connection.dropDatabase();
  await seedUsers();
  await seedCategories();
  await seedProducts();
  await seedReviews();
  mongoose.connection.close();

  console.log('Finished Database Seeding!');
}

seedAll().catch((err) => console.error(err));