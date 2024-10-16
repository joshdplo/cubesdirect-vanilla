const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/db.sqlite')
});

// Confirm connection
sequelize.authenticate()
  .catch((error) => {
    console.error(error);
    console.error('Unable to connect to sqlite database via sequelize. We need that. Exiting now.');
    process.exit(1);
  });

module.exports = sequelize;