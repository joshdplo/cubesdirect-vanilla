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

// Reset Password Request Page (GET)
export const accountResetPasswordRequest = async (req, res, next) => {
  try {
    // if user is already logged in, redirect to the change password page
    if (res.locals.user) return res.redirect('/account/change-password');

    res.render('pages/account/reset-password-request', {
      title: 'Reset Password'
    });
  } catch (error) {
    console.error(error.message);
    error.status = 500;
    next(error);
  }
}