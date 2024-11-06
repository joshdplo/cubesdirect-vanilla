/**
 * Products Map
 */
/**
+++ IDEAS +++
- matte/glossy finish choice
- 

+++ CATEGORIES +++
- Classic (colors, materials, patterns, etc) - CUSTOMIZABLE
- Seasonal (winter, summer, fall, spring, christmas, halloween, easter, etc)
- Media (better name? culture?) (tv show characters, movie characters, bands, etc)
- Sports (nfl, nhl, nba)
99. Backers (super special) ie/. mini, mom, dad
 */

/**
 * Product Customizations
 */
const singleColor = (color) => ({
  front: color,
  back: color,
  left: color,
  right: color,
  top: color,
  bottom: color
});

const colors = (colorsObj) => {
  const { front, back, left, right, top, bottom } = colorsObj;
  return {
    front,
    back,
    left,
    right,
    top,
    bottom,
  };
};

const engraving = (message, position) => ({
  message,
  position,
});

const size = [
  '2in',
  '3in',
  '4in',
  '5in',
];

const finish = [
  'matte',
  'glossy',
];

const metal = [
  'aluminum',
  'copper',
  'silver',
  'gold',
];

const wood = [
  'birch',
  'oak',
];

const pattern = [
  'plaid',
  'stripes-horizontal',
  'stripes-vertical',
  'cheetah',
  'leopard',
  'zebra',
  'cow'
];



/**
 * Generate Products
 * @TODO: fill in descriptions
 * @TODO: generate slug, images (images will use slug)
 */
export const products = [
  // CLASSIC
  {
    name: 'Color Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'finish', 'singleColor', 'colors', 'engraving']
  },
  {
    name: 'Pattern Cube',
    description: '',
    price: 4.99,
    stock: 1000,
    customizations: ['size', 'finish', 'singleColor', 'colors', 'pattern', 'engraving']
  },
  {
    name: 'Metal Cube (2")',
    description: '',
    price: 9.99,
    stock: 1000,
    customizations: ['metal', 'engraving']
  },
  {
    name: 'Wood Cube (2")',
    description: '',
    price: 7.99,
    stock: 1000,
    customizations: ['wood', 'engraving']
  },
  {
    name: 'Light Cube (2")',
    description: 'A translucent cube with a LED light inside. The cube\'s colors determine the light color! ',
    price: 5.99,
    stock: 1000,
    customizations: ['singleColor', 'colors', 'engraving']
  },

  // SEASONAL:CHRISTMAS
  {
    name: 'Christmas Tree Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Santa Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Santa Sleigh Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Elf Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Rudolph Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Candy Cane Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Wreath Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Ornament Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Christmas Lights Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Gingerbead Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Nutcracker Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Christmas Angel Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },
  {
    name: 'Nativity Cube',
    description: '',
    price: 3.99,
    stock: 1000,
    customizations: ['size', 'engraving']
  },

];