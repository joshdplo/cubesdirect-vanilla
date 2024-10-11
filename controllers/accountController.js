// Index Page
exports.accountPage = async (req, res, next) => {
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
