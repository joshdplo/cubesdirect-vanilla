require('dotenv').config();
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');
const CartItem = require('../models/CartItem');
const OrderItem = require('../models/OrderItem');

const seedDB = async () => {
  console.log('Starting Database Seeding...');
  try {
    console.log('-> Syncing Database (drop + recreate tables)...');
    await sequelize.sync({ force: true });
    console.log('-> Sync Complete!');

    // Create users
    console.log('-> Seeding Users...');
    const users = [];
    for (let i = 0; i < 10; i++) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(faker.internet.password(), salt);

      const user = await User.create({
        email: faker.internet.email(),
        password: hashedPassword,
        isVerified: faker.datatype.boolean(),
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
      users.push(user);
    }
    console.log('-> Users complete!');

    // Create categories
    console.log('-> Seeding Categories...');
    const categoryObjs = ['Classic', 'Deluxe', 'Nature', 'Fashion', 'Seasonal', 'International', 'Pop'].map((category) => ({
      name: category.toLowerCase(),
      description: faker.lorem.sentence()
    }));
    const categories = await Category.bulkCreate(categoryObjs);
    console.log('-> Categories complete!');

    // Create Products
    console.log('-> Seeding Products...');
    const products = [];
    for (let i = 0; i < 30; i++) {
      const productName = `${faker.commerce.productName()} Cube`;

      const product = await Product.create({
        name: productName,
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 0, max: 100 }),
        images: [faker.image.urlPicsumPhotos()],
        featured: faker.datatype.boolean(),
      });
      product.addCategory(categories[Math.floor(Math.random() * categories.length)]);

      products.push(product);
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