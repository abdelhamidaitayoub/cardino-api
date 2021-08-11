/* eslint-disable */

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const Card = require('../../models/Card');
const User = require('../../models/User');

dotenv.config({ path: './../../.env' });

const connectionString = process.env.DB_URI.replace(
  '<password>',
  process.env.DB_PASSWORD
).replace('<user>', process.env.DB_USER);

(async () => {
  try {
    await mongoose.connect(connectionString, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    // await mongoose.connect('mongodb://localhost:27017/cardino', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database seccessfully connected');
  } catch (err) {
    console.log('Database Error 💥', err);
  }
})();

// const cards = JSON.parse(fs.readFileSync(`${__dirname}/Cards.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async () => {
  try {
    // await Card.create(cards);
    await User.create(users, { validateBeforeSave: false });
    console.log('✅ Data successfully Added');
  } catch (err) {
    console.log(`Error 💥: ${err}`);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    // await Card.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Data successfully deleted');
  } catch (err) {
    console.log(`Error 💥: ${err}`);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  process.exit();
}
