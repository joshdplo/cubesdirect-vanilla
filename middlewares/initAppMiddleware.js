import 'dotenv/config';
import Category from '../models/Category.js';
import stringUtils from '../util/stringUtils.js';

// Populate app.locals with initial data
const initAppData = async (app) => {
  try {
    const categoryData = await Category.findAll({
      where: { parentId: null },
      include: [
        {
          model: Category,
          as: 'subcategories'
        }
      ]
    });

    const formattedCategories = categoryData.map(category => ({
      id: category.id,
      parentId: category.parentId || null,
      name: category.name,
      description: category.description,
      featured: category.featured,
      subcategories: category.subcategories.map(subcat => ({
        id: subcat.id,
        parentId: subcat.parentId || null,
        name: subcat.name,
        description: subcat.description,
        featured: subcat.featured
      }))
    }));

    app.locals.stringUtils = stringUtils;
    app.locals.categories = formattedCategories;
    app.locals.title = null; // overridden by res, needed for all pages
    app.locals.bundle = null; // overridden by res, needed for all pages
    app.locals.user = null; // overridden by res, needed for all pages
    app.locals.cart = null; // overridden by res, needed for all pages
    app.locals.messages = null; // overridden by res, needed for all pages
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