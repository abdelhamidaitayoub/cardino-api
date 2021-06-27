require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

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
    console.log('Database seccessfully connected');
  } catch (err) {
    console.log('Database Error 💥', err);
  }
})();

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server running in http://localhost:${port}`);
});
