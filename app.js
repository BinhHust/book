const express = require('express');
const morgan = require('morgan');

const app = express();

// Log request in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global middleware
app.use('/', (req, res, next) => {
  res.send('heloo form be');
});

module.exports = app;
