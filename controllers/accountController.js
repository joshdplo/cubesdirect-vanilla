// Register Page (GET)
//@TODO redirect to account if logged-in
exports.accountRegister = async (req, res, next) => {
  try {
    res.render('pages/account/register', {
      title: 'Register'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Login Page (GET)
//@TODO redirect to account if logged-in
exports.accountLogin = async (req, res, next) => {
  try {
    res.render('pages/account/login', {
      title: 'Log in'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Account Page (GET)
exports.accountPage = async (req, res, next) => {
  try {
    res.render('pages/account/account', {
      title: 'Account'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Verify Email Page (GET)
exports.accountVerifyEmail = async (req, res, next) => {
  try {
    res.render('pages/account/verify-email', {
      title: 'Verify Email'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Reset Password Page (GET)
exports.accountResetPassword = async (req, res, next) => {
  try {
    res.render('pages/account/reset-password', {
      title: 'Reset Password'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Change Password Page (GET)
exports.accountChangePassword = async (req, res, next) => {
  try {
    res.render('pages/account/change-password', {
      title: 'Update Password'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}
