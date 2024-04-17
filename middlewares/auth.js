export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.json({ success: false, redirectURL: '/auth/login' });
}

export function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.json({ success: false, redirectURL: '/' });
}
