require('dotenv').config();
const mongoose = require('mongoose');

process.on('uncaughtException', function (err) {
  console.log('UNCAUGHT EXCEPTION 💥');
  console.log(err.name, err.message);
  this.exit(1);
});

const app = require('./app');

console.log(`${process.env.NODE_ENV.toLocaleUpperCase()} MODE`);

// const connectionString = process.env.DB_URI.replace(
//   '<password>',
//   process.env.DB_PASSWORD
// ).replace('<user>', process.env.DB_USER);

(async () => {
  try {
    // await mongoose.connect(connectionString, {
    //   useCreateIndex: true,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useFindAndModify: false
    // });
    await mongoose.connect('mongodb://localhost:27017/cardino', {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
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

process.on('unhandledRejection', function (reason) {
  console.log('UNHANDLED PROMISE REJECTION 💥');
  console.log(reason.name, reason.message);
  server.close(() => {
    this.exit(1);
  });
});
