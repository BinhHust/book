const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/Email');

// NOTE: Send Token
const sendToken = (user, statusCode, req, res) => {
  // create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });

  // send token to client and store in cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    )
  });

  // delete password, active from output (select: false)
  if ('password' in user) user.password = undefined;
  // if ('active' in user) user.active = undefined;

  // send token + data to client(fe)
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// NOTE: Sign Up
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const verifyToken = newUser.createVerifyToken();
  await newUser.save({ validateBeforeSave: false });

  try {
    const url = `${req.protocol}://${req.get(
      'host'
    )}/verifyEmail/${verifyToken}`;

    await new Email(newUser, url).sendWellcome();

    res.status(200).json({
      status: 'success',
      message: 'Check email in order to verify.'
    });
  } catch (err) {
    await User.findByIdAndDelete(newUser._id);

    return next(new AppError('Send email verification failed', 400));
  }
});

// NOTE: Verify Token
exports.verifyToken = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const verifyToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({ verifyToken });

  if (!user) {
    return next(new AppError('Verify token invalid.'));
  }

  user.active = true;
  user.verifyToken = undefined;
  await user.save({ validateBeforeSave: false });

  sendToken(user, 201, req, res);
});

// NOTE: Log In
exports.login = catchAsync(async (req, res, next) => {
  // email + pw ?
  if (!req.body.email || !req.body.password) {
    return next(new AppError('Please provide email and password.', 401));
  }
  // email + pw valid ?
  const currentUser = await User.findOne({ email: req.body.email }).select(
    '+password'
  );

  if (
    !currentUser ||
    currentUser.active === false ||
    !(await currentUser.isCorrectPassword(
      req.body.password,
      currentUser.password
    ))
  ) {
    return next(new AppError('Either email or password invalid.', 401));
  }

  // send token
  sendToken(currentUser, 200, req, res);
});

// NOTE: Log out
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

// NOTE: Protect
exports.protect = catchAsync(async (req, res, next) => {
  // get token from headers || cookies
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // token valid ?
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // user exists ?
  const currentUser = await User.findOne({
    _id: decode.id,
    active: true
  }).populate('shop');

  if (!currentUser) {
    return next(new AppError('User is not exists.', 400));
  }

  // password co bi thay doi sau khi token nay dc tao?
  if (currentUser.isChangedPassword(decode.iat)) {
    return next(new AppError('Password has changed.', 401));
  }

  // cap quyen truy cap
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// NOTE: isLoggedIn
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findOne({ _id: decode.id, active: true });

      if (!currentUser) {
        return next();
      }

      // password co bi thay doi sau khi token nay dc tao?
      if (currentUser.isChangedPassword(decode.iat)) {
        return next();
      }

      // cap quyen truy cap
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }

  next();
});

// NOTE: restrict
exports.restrict = (...roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }

  next(new AppError('You are not authorized to access this page.', 403));
};

// NOTE: Update Password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;
  console.log(passwordCurrent, password, passwordConfirm);
  // get user
  const user = await User.findById(req.user.id).select('+password');

  // check currrent passwordsend
  if (!(await user.isCorrectPassword(passwordCurrent, user.password))) {
    return next(new AppError('Current password incorrect.', 401));
  }
  // update new password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // send token
  sendToken(user, 200, req, res);
});
