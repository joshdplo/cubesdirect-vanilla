/**
 * Products Map
 */
/**
+++ IDEAS +++
- matte/glossy finish choice
- 

+++ CATEGORIES +++
1. Classic (colors) - CUSTOMIZABLE
2. Patterns (patterns ie. plaid/zebra/leopard/checkered/circles) - CUSTOMIZABLE

3. Media (better name? culture?) (tv show characters, movie characters, bands, etc)
4. Seasonal (winter, summer, fall, spring, christmas, halloween, easter, etc)
5. Sports (nfl, nhl, nba)
99. Backers (super special) ie/. mini, mom, dad
 */

/**
 * Generate Products
 * @TODO: fill in descriptions
 * @TODO: generate slug, images (images will use slug)
 */
export const products = [
  // CLASSIC
  {
    name: "Single Color",
    description: "",
    price: 4.99,
    stock: 1000,
    custom: {
      singleColor: ''
    }
  },
  {
    name: "Single Color with Engraving",
    description: "",
    price: 4.99,
    stock: 1000,
    custom: {
      colors: []
    }
  },
  {
    name: "Custom Colors",
    description: "",
    price: 6.99,
    stock: 1000,
  },

  // PATTERNS
  {
    name: "Plaid",
    description: "",
    price: 6.99,
    stock: 1000,
  },
  {
    name: "Stripes (Horizontal)",
    description: "",
    price: 6.99,
    stock: 1000,
  },
  {
    name: "Stripes (Vertical)",
    description: "",
    price: 6.99,
    stock: 1000,
  },

];