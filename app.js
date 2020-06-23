const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const AppError = require('./utils/AppError');
const globalErrorHander = require('./controllers/errorController');
const userRouter = require('./routers/userRouter.js');
const viewRouter = require('./routers/viewRouter.js');
const shopRouter = require('./routers/shopRouter.js');
const bookRouter = require('./routers/bookRouter.js');
const cartRouter = require('./routers/cartRouter.js');

// Start express app
const app = express();

const store = new MongoDBStore({
  uri: process.env.DATABASE_REMOTE,
  collection: 'sessions'
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store
  })
);

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// 1) Global middleware
// 1.1) Implement CORS

// 1.2) Serving static files
app.use(express.static(`${__dirname}/public`));

// 1.3) Set security HTTP headers

// 1.4) Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 1.5) Limit requests from same API

// 1.6 ) Stripe webhook, BEFORE body-parser, because stripe needs the body as stream

// 1.7) Body parser, reading data from body into req.body
app.use(express.json());

// 1.8) Cookie parse
app.use(cookieParser());

// 1.9) Data sanitization against NoSQL query injection

// 1.10) Data sanitization against XSS

// 1.11) Prevent parameter pollution

// 1.12) Compression

// 1.13) Test middleware
app.use((req, res, next) => {
  next();
});

// 2) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/shops', shopRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/cart', cartRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} not found.`, 400));
});

// 3) Global error handling
app.use(globalErrorHander);

module.exports = app;
