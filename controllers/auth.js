const passport = require('passport');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    session: false,
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureMessage: true,
  });
};

exports.signup = async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    const exUser = await prisma.user.findUnique({ where: { email } });
    if (exUser) {
      return res.json({ success: false, message: 'email exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    return req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      return res.json({ success: true });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

exports.renderLogin = (req, res, next) => {
  res.render('login', { title: 'Login - Worship Presneter' });
};

exports.renderSignup = (req, res, next) => {
  res.render('signup', { title: 'Sign Up- Worship Presneter' });
};
