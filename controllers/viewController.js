exports.getSignUpPage = (req, res, next) => {
  res.render('signup', {
    title: 'Sign up'
  });
};

exports.getVerifyEmailPage = (req, res, next) => {
  res.render('verifyEmail', {
    title: 'Verify email'
  });
};

exports.getLogInPage = (req, res, next) => {
  res.render('login', {
    title: 'Log in'
  });
};

exports.getHomePage = (req, res, next) => {
  res.render('homepage', {
    title: 'Homepage'
  });
};
