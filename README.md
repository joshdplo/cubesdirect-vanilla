# CubesDirect (Vanilla)
A mock e-commerce site built using Node, Express, SQLite, EJS, vanilla JavaScript and vanilla CSS.

## THIS PROJECT IS INCOMPLETE
It still runs fine, and it's about 85% complete, but the UI is largely missing.

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
