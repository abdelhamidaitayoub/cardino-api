const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cardsRoute = require('./routes/cardRoutes');
const usersRoute = require('./routes/userRoutes');
const tagsRoute = require('./routes/tagRoutes');
const errorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();

// Serve static files such as images, css files
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(cors());

app.use('/api/v1/cards', cardsRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/tags', tagsRoute);

//
// Missing end-point Error
//
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.url} on this server`, 404));
});

//
// ERROR HANDLING MIDDLEWARE
//
app.use(errorHandler);

module.exports = app;
