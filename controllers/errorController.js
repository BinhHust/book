// const AppError = require('../utils/AppError');

const handleErrorForDev = (req, res, err) => {
  // Loi throw tu api
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }

  // Loi throw tu view
};

const handleErrorForProd = (req, res, err) => {
  // Loi throw tu api
  if (req.originalUrl.startsWith('/api')) {
    // Loi du doan duoc
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    // Loi ko du doan duoc
    res.status(500).json({
      status: 'error',
      message: 'Somthing went wrong!'
    });
  }

  // Loi throw tu view
};

const globalErrorHander = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    handleErrorForDev(req, res, err);
  }

  handleErrorForProd(req, res, err);
};

module.exports = globalErrorHander;
