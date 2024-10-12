//@TODO: make util to render login page if not authenticated
// if (!res.locals.isAuthenticated) return res.render('pages/login', { title: 'Log in' });

// Register Page
exports.accountRegister = async (req, res, next) => {
  try {
    res.render('pages/register', {
      title: 'Register'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Login Page
exports.accountLogin = async (req, res, next) => {
  try {
    res.render('pages/login', {
      title: 'Log in'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Account Page
exports.accountPage = async (req, res, next) => {
  if (!res.locals.isAuthenticated) return res.render('pages/login', { title: 'Log in' });

  try {
    res.render('pages/account', {
      title: 'Account'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
};

// Reset Password Page
exports.accountResetPassword = async (req, res, next) => {
  if (!res.locals.isAuthenticated) return res.render('pages/login', { title: 'Log in' });

  try {
    res.render('pages/reset-password', {
      title: 'Reset Password'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}

// Change Password Page
exports.accountChangePassword = async (req, res, next) => {
  if (!res.locals.isAuthenticated) return res.render('pages/login', { title: 'Log in' });

  try {
    res.render('pages/change-password', {
      title: 'Update Password'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}
