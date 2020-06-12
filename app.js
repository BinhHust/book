const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/AppError');
const globalErrorHander = require('./controllers/errorController');
const userRouter = require('./routers/userRouter.js');

const app = express();

// 1) Global middleware
// 1.1) Log request in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 1.2) body parser
app.use(express.json());

// app.use('/', (req, res, next) => {
//   next();
// });

// 2) router
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} not found.`, 400));
});

// 3) global error handling
app.use(globalErrorHander);

module.exports = app;
