exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // res.redirect('/auth/login');
  res.json({ success: false, redirectURL: '/auth/login' });
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  // res.redirect('/');
  res.json({ success: false, redirectURL: '/' });
};
