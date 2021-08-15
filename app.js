const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
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

//# Set secure HTTP headers
app.use(helmet());

//# Enable all cors requests
app.use(
  cors({
    origin: `${process.env.CLIENT_HOSTNAME}:${process.env.CLIENT_PORT}`,
  })
);

// Based on body-parser
app.use(express.json({ limit: '50kb' }));

//# Sanitization
app.use(xss());
app.use(mongoSanitize());

//# HTTP parameter pollution
app.use(hpp());

//# Limit repeated requests
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  headers: true,
  message: 'You have exceeded the 100 requests in 1 hrs limit!',
});
app.use('/api', limiter);

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
