require('dotenv').config();
const stringUtils = require('../util/stringUtils');
const categoryCache = require('../services/categoryCache');

// Populate app.locals with initial data
const initAppData = async (app) => {
  try {
    const categoryData = await categoryCache.getCache();

    app.locals.stringUtils = stringUtils;
    app.locals.categoryData = categoryData;
    app.locals.title = null; // overridden by res.locals.title
    app.locals.user = null; // overridden by res.locals.user
    app.locals.global = {
      SITE_NAME: process.env.NAME
    }

    console.log('app.locals populated successfully');
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
};

module.exports = initAppData;