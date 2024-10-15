require('dotenv').config();
const { getCache: getCategoryCache } = require('../services/categoryCache');
const stringUtils = require('../util/stringUtils');

// Populate app.locals with initial data
const initAppData = async (app) => {
  try {
    const categoryData = await getCategoryCache({ queryType: 'findAll' });

    app.locals.stringUtils = stringUtils;
    app.locals.categoryData = categoryData;
    app.locals.title = null; // overridden by res.locals.title
    app.locals.user = null; // overridden by res.locals.user
    app.locals.global = {
      SITE_NAME: process.env.NAME
    }

    console.log(`app.locals populated successfully (${Object.keys(app.locals).length} items)`);
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
};

module.exports = initAppData;