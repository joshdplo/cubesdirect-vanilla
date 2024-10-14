# CubesDirect
A mock e-commerce site built using Node, Express, SQLite, and (insert FE tech here). This project was created in October 2024.

## Why I made CubesDirect
I made this project for xxxxxxxxxx

### Process
The process for creating CubeMart was xxxxxxxxxx
1. Planning
  - @TODO
2. Building
  - @TODO
3. Polishing
  - @TODO
4. Deploying
  - @TODO

### What I Learned from this project

#### Blender
- General lighting
- Area lighting for products
- More about PBR textures

#### Node
- Basic authentication with JWT
- Introduction to SQLite via Sequelize
- Migrating from MongoDB/Mongoose to SQLite/Sequelize
- Introduction to database seeding with faker.js (both mongodb and sqlite)

#### Front End
- Product image optimization

### TODO Dev
- ~~create initial db seed (random is fine for now)~~
- ~~decide on templating engine~~
- ~~migrate models and db code from mongodb/mongoose to sqlite/sequelize~~
- ~~better error handling in server.js, test non-404 errors~~
- ~~check that req.id is added/accessible to newly-registered users~~
- ~~if a new account is registered, req.user.id is not available in the req.user object =/~~
- ~~make user data available to locals with checkAuth middleware (or new middleware if needed)~~
- change repo name & folder names to "cubesdirect"
- fix jwt invalid signature error in authMiddleware (both in getUser and in checkAuth, is in authController as well!!)
- investigate calls happening twice (ie. getUser middleware called twice even on index page)
- create caching strategy
  - categories = in-memory cache
  - products = cache all but 'stock' (any others?) + event-based caching
- set up email functionality `ongoing`
  - verify ("welcome to cubesdirect")
  - password reset
  - order confirmation
  - order shipped
  - order delivered
- set up user add address functionality
- add 'reviewer' role to users after a single purchase

### TODO Design
- ??hamburger thick verts with 1-2px border radius - sharp, subtle drop shadows??
- ??incorporate very sharp, subtle drop shadows in the UI to feel more cubey??
- global message accessibility
- banner/advert for low-stock items (1-5)

### TODO Cleanup
- create a 'setup' script that is checked on 'npm run dev'
  - check for .env file. if not exist, copy .env.example (or create new .env)
  - this will eliminate the need for people cloning the project to do anything other than npm i / npm start
- global/shared validation: sequelize models, BE <-> FE user inputs, FE form input error messages  (typescript?)
- decide if product quantities should be selectable (ie. 1-10 dropdown) or just 1 at a time
- product slugs for URLs

### TODO Final
- create JSON files for live DB seed (and update seed file)
  - include correct product items
- Nodemailer Setup (optional)
  - when running/developing locally
  - using mailtrap for email testing (oct 2024)
    - sign up on mailtrap WITH THE EMAIL YOU WILL BE SENDING TO
    - review mailtrap's blog post on (how to use mailtrap with nodemailer here)[https://mailtrap.io/blog/sending-emails-with-nodemailer/] (credentials in next bullet point)
    - go to sending domians > demomailtrap.com > integration > transactional stream
      - use the host, port, username, and password listed to configure nodemailer's mailOptions object (username will most likely be "api")
    - you can use `node scripts/email-test.js` to test that emails are sent
    - NOTE: you can only send mails via mailtrap to the *address you created your mailtrap account with* (you **can** change your mailtrap email account if needed!)
  - using gmail for email testing
    - i didn't test gmail sending, but (here is a note from nodemailer on using gmail)[https://nodemailer.com/usage/using-gmail/]. With a potential couple extra steps, it *should* work.
