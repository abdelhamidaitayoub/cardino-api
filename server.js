require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

console.log(`${process.env.NODE_ENV.toLocaleUpperCase()} MODE`);

const connectionString = process.env.DB_URI.replace(
  '<password>',
  process.env.DB_PASSWORD
).replace('<user>', process.env.DB_USER);

(async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // await mongoose.connect('mongodb://localhost:27017/cardino', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database seccessfully connected');
  } catch (err) {
    console.log('Database Error 💥', err);
  }
})();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server running in http://localhost:${port}`);
});
