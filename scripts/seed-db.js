import 'dotenv/config';
import sequelize from '../config/db.js';
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';

// initialize sequelize session store (so we can delete its contents later)
const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });

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

async function generateCategoryData() {
  const categories = [
    {
      id: 1,
      name: 'Classic',
      description: 'Cubes fit for any occasion',
      featured: faker.datatype.boolean()
    },
    {
      id: 2,
      name: 'Seasonal',
      description: 'Celebrate the seasons with cubes',
      featured: faker.datatype.boolean()
    },
    {
      id: 3,
      parentId: 2,
      name: 'Christmas',
      description: 'Have a holly-jolly cubesmas',
      featured: faker.datatype.boolean()
    },
    {
      id: 4,
      parentId: 2,
      name: 'Halloween',
      description: 'Creepy, crawly, spooky cubes',
      featured: faker.datatype.boolean()
    },
    {
      id: 5,
      name: 'Sports',
      description: 'Your favorites sports teams...on cubes',
      featured: faker.datatype.boolean()
    },
    {
      id: 6,
      parentId: 5,
      name: 'NFL',
      description: 'Cubes of the NFL',
      featured: faker.datatype.boolean()
    },
    {
      id: 7,
      parentId: 5,
      name: 'NHL',
      description: 'Cubes of the NHL',
      featured: faker.datatype.boolean()
    },
    {
      id: 8,
      parentId: 5,
      name: 'NBA',
      description: 'Cubes of the NBA',
      featured: faker.datatype.boolean()
    },
    {
      id: 9,
      name: 'Culture',
      description: 'Culture and media shrunk down to cube size',
      featured: faker.datatype.boolean()
    },
    {
      id: 10,
      parentId: 9,
      name: 'Star Trek',
      description: 'Cube resistance is futile',
      featured: faker.datatype.boolean()
    },
    {
      id: 11,
      parentId: 9,
      name: 'Orphan Black',
      description: 'Cube sisters',
      featured: faker.datatype.boolean()
    },
    {
      id: 12,
      parentId: 9,
      name: 'Dragonball Z',
      description: 'Kame hame cube',
      featured: faker.datatype.boolean()
    },
    {
      id: 13,
      name: 'Backers',
      description: 'The true cube heroes',
      featured: faker.datatype.boolean()
    },
  ];

  return categories;
}

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
          firstName: `${firstName}`,
          lastName: faker.person.lastName(),
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode()
        }
      ]
    };
    users.push(user);
  }

  return users;
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
      images: ['/images/products/placeholder.webp'],
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
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        shippingAddress: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode()
        },
        billingAddress: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode()
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

    // Remove Session Data
    console.log('-> Deleting session data...');
    await sequelize.models.Session.destroy({
      where: {},
      truncate: true
    });
    console.log('-> Session data deleted!');

  } catch (err) {
    console.error('ERROR seeding database:', err);
  } finally {
    console.log('Completed Database Seeding!');
    sequelize.close();
  }
}

seedDB();