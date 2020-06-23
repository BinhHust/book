const Shop = require('../models/shopModel');
const Book = require('../models/bookModel');
const catchAsync = require('../utils/catchAsync');

exports.getSignUpPage = (req, res, next) => {
  res.render('signup', {
    title: 'Sign up'
  });
};

exports.getVerifyEmailPage = (req, res, next) => {
  res.status(200).render('verifyEmail', {
    title: 'Verify email'
  });
};

exports.getLogInPage = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log in'
  });
};

exports.getHomePage = catchAsync(async (req, res, next) => {
  const shops = await Shop.find();

  res.status(200).render('homepage', {
    title: 'Homepage',
    shops
  });
});

exports.getAccountPage = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Account'
  });
};

exports.getDetailShopPage = catchAsync(async (req, res, next) => {
  const shop = await Shop.findOne({ slug: req.params.slugShop }).populate(
    'books'
  );

  res.status(200).render('detailShop', {
    title: shop.name,
    shop
  });
});

exports.getBooksPage = catchAsync(async (req, res, next) => {
  const books = await Book.find().populate('shop');

  res.status(200).render('books', {
    title: 'Books',
    books
  });
});

exports.getCartPage = catchAsync(async (req, res, next) => {
  res.status(200).render('cart', {
    title: 'Cart'
  });
});
