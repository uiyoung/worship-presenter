const passport = require('passport');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureMessage: true,
});

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
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ success: true });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderLogin = (req, res, next) => {
  res.render('pages/login.njk', { title: 'Login - Worship Presneter' });
};

exports.renderSignup = (req, res, next) => {
  res.render('pages/signup.njk', { title: 'Sign Up- Worship Presneter' });
};
