import 'dotenv/config';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/en_US';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import CartItem from '../models/CartItem.js';
import OrderItem from '../models/OrderItem.js';

async function generateUserData() {
  const users = [];
  const addressTitleNouns = ['house', 'appartment', 'business', 'condo', 'townhouse', 'vacation house', 'timeshare'];
  for (let i = 1; i < 11; i++) {
    const firstName = faker.person.firstName();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123', salt);

    // users will be test1@test.com, test2@test.com, etc
    const user = {
      email: `test${i}@test.com`,
      password: hashedPassword,
      isVerified: faker.datatype.boolean(),
      addresses: [
        {
          default: true,
          title: `${firstName} ${addressTitleNouns[Math.floor(Math.random() * addressTitleNouns.length)]}`,
          receiverName: `${firstName} ${faker.person.lastName()}`,
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode(),
          country: faker.location.country(),
          phone: faker.phone.number({ style: 'international' }),
        }
      ]
    };
    users.push(user);
  }

  return users;
}

async function generateCategoryData() {
  const categories = ['Classic', 'Deluxe', 'Nature', 'Fashion', 'Seasonal', 'International', 'Pop'].map((category) => ({
    name: category.toLowerCase(),
    description: faker.lorem.sentence(),
    featured: faker.datatype.boolean()
  }));
  return categories;
}

async function generateProductData() {
  const numberOfProducts = 50;
  const products = [];
  const uniqueProductNames = faker.helpers.uniqueArray(faker.commerce.productName, numberOfProducts);

  for (let i = 0; i < numberOfProducts; i++) {
    const product = {
      name: `${uniqueProductNames[i]} Cube`,
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      stock: faker.number.int({ min: 0, max: 100 }),
      images: ['/images/product/placeholder.webp'],
      featured: faker.datatype.boolean(),
    };

    products.push(product);
  }

  return products;
}

const seedDB = async () => {
  console.log('Starting Database Seeding...');
  try {
    console.log('-> Syncing Database (drop + recreate tables)...');
    await sequelize.sync({ force: true });
    console.log('-> Sync Complete!');

    // Create users
    console.log('-> Seeding Users...');
    const userData = await generateUserData();
    const users = await User.bulkCreate(userData);
    console.log('-> Users complete!');

    // Create categories
    console.log('-> Seeding Categories...');
    const categoryData = await generateCategoryData();
    const categories = await Category.bulkCreate(categoryData);
    console.log('-> Categories complete!');

    // Create Products
    console.log('-> Seeding Products...');
    const productData = await generateProductData();
    const products = [];
    for (let i = 0; i < productData.length; i++) {
      try {
        const product = await Product.create(productData[i]);
        product.addCategory(categories[Math.floor(Math.random() * categories.length)]);
        products.push(product);
      } catch (error) {
        console.error('Error seeding products:', error);
      }
    }
    console.log('-> Products complete!');

    // Create Carts and associate Products with them
    console.log('-> Seeding Carts (with associated Products)...');
    for (const user of users) {
      const cart = await Cart.create({ userId: user.id });

      for (let i = 0; i < 3; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        await CartItem.create({
          cartId: cart.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 5 }),
          price: product.price
        });
      }
    }
    console.log('-> Carts complete!');

    // Create Orders and associate Prodcuts with them
    console.log('-> Seeding Orders (with associated Products)...');
    for (const user of users) {
      const order = await Order.create({
        userId: user.id,
        totalAmount: faker.commerce.price(50, 300, 2),
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        deliveryAddress: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode(),
          country: faker.location.country(),
        }
      });

      for (let i = 0; i < 3; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        await OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 5 }),
          price: product.price
        });
      }
    }
    console.log('-> Orders complete!');

    // Create Reviews
    console.log('-> Seeding Reviews...');
    for (const product of products) {
      for (let i = 0; i < 3; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        await Review.create({
          userId: user.id,
          productId: product.id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentences(2)
        })
      }
    }
    console.log('-> Reviews complete!');
  } catch (err) {
    console.error('ERROR seeding database:', err);
  } finally {
    console.log('Completed Database Seeding!');
    sequelize.close();
  }
}

seedDB();