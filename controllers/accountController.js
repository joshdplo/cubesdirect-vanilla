// Register Page (GET)
//@TODO redirect to account if logged-in
export const accountRegister = async (req, res, next) => {
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
export const accountLogin = async (req, res, next) => {
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
export const accountPage = async (req, res, next) => {
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
export const accountVerifyEmail = async (req, res, next) => {
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
export const accountResetPassword = async (req, res, next) => {
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
export const accountChangePassword = async (req, res, next) => {
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
