# CubesDirect (Vanilla)
A mock e-commerce site built using Node, Express, SQLite, EJS, vanilla JavaScript and vanilla CSS.

## Running Locally
- Nodemailer Setup **(optional)**
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

## Why I made CubesDirect
I made this project for xxxxxxxxxx

### Process
The process for creating CubesDirect was xxxxxxxxxx
1. Planning
  - @TODO
2. Building
  - @TODO
3. Polishing
  - @TODO
4. Deploying
  - @TODO

### What I learned & improved on from this project

#### Node
- Introduction to basic authentication with JWT
- Introduction to SQLite via Sequelize
- Introduction to sessions in express in general + via express-session + connect-session-sequelize
- Migrating from MongoDB/Mongoose to SQLite/Sequelize
- Introduction to database seeding with faker.js

#### Front End
- Experiment with bundling code based on pages' components
- Cube Customizer

#### Devops
- Continue practicing basic linux server setup & operation
- Continue practicing basic nginx/node setup & configuration
- Continue practicing using letsencrypt via certbot for nginx
- Introduction to setting up postfix as a send-only mail server for transactional emails

#### Blender
- Practice general lighting
- Introduction to area lighting for products
- Introduction to PBR textures basics

------------------

### TODO FE
- ensure svg icons are scaling with zoom (move away from feathericons?)
- revisit/refine font size clamping
- global message accessibility (error = aria-role="alert")
- header accessibility (if introducing dropdowns)
- add 'show password' functionality to password fields

### TODO BE
- guest user shipping address should be able to be re-used for guest billing address
- if user starts an order, refresh their access token
- implement joi validation on all models
- product slugs for URLs and categories
- revisit caching strategy, where can it be used to better affect as we get closer to launch?
- mock up order shipped + order delivered logic + emails (after 1 minute each)

### TODO Final
- finalize product/category data + images (`products.js`)
- create a setup script that is checked on `npm start` (should be lightweight enough)
  - check for env file and copy if not exist (DONE)
  - check for `data/db.sqlite` and seed db if not exist

### TODO Optional
- basic address validation?