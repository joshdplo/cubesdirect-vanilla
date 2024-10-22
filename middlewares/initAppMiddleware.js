import 'dotenv/config';
import categoryCache from '../services/categoryCache.js';
import stringUtils from '../util/stringUtils.js';

// Populate app.locals with initial data
const initAppData = async (app) => {
  try {
    const categoryData = await categoryCache.getCache({ queryType: 'findAll' });

    app.locals.stringUtils = stringUtils;
    app.locals.categoryData = categoryData;
    app.locals.title = null; // overridden by res
    app.locals.user = null; // overridden by res
    app.locals.cart = null; // overridden by res
    app.locals.messages = null; // overridden by res
    app.locals.global = {
      SITE_NAME: process.env.NAME,
      EMAIL_ENABLED: process.env.EMAIL_ENABLED === 'true' ? true : false
    }

    console.log(`app.locals populated successfully (${Object.keys(app.locals).length} items)`);
  } catch (error) {
    console.error('Error initializing app data:', error);
  }
};

export default initAppData;