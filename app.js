const express = require('express');
const cardsRoute = require('./routes/cardRoutes');
const errorHandler =  require('./controllers/errorController');
const CustomError = require('./utils/customError');

const app = express();
app.use(express.json());

app.use('/api/v1/cards', cardsRoute);

//
// Missing end-point
//
app.all('*', (req, res, next) => {
  next(new CustomError(`Can't find ${req.url} on this server`, 404));
});

//
// ERROR HANDLING MIDDLEWARE
//
app.use(errorHandler);

module.exports = app;