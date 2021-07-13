const CustomError = require('../utils/customError');

const handleCastErrorDB = (err) => {
  const msg = `invalid ${err.path}: ${err.value}`;
  return new CustomError(msg, 400);
};

const handleDeplicateFieldsDB = (err) => {
  const [key] = Object.keys(err.keyValue);
  const value = err.keyValue[key];
  const msg = `Deplicate fields value : { ${key}: "${value}" }, please try anothor value!`;
  return new CustomError(msg, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const msg = `invalid input data. ${errors.join('. ')}`;
  return new CustomError(msg, 400);
};

const handleJsonWebTokenErrorDB = () =>
  new CustomError('invalide token, please log in again', 401);

const handleTokenExpiredErrorDB = () =>
  new CustomError('expired token, please log in again', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERED ERROR (not implement)
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Operational, trusted error
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or unknown error
    // 1: log error
    console.error('Error 💥', err);

    // 2: send static error
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // RENDERED ERROR (not implement)
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(err);
    if (error.code === 11000) error = handleDeplicateFieldsDB(err);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenErrorDB();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredErrorDB();

    sendErrorProd(error, req, res);
  }
};
