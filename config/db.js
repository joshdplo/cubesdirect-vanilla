const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/db.sqlite')
});

// Test connection
//@TODO: understand this more
sequelize.authenticate()
  .then(() => console.log('Connection established with SQLite'))
  .catch((err) => console.error('Unable to connect: ', err));

module.exports = sequelize;