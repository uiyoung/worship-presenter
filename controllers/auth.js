import passport from 'passport';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureMessage: true,
});

export async function signup(req, res, next) {
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
}

export function logout(req, res, next) {
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
}

export function renderLogin(req, res, next) {
  res.render('pages/login.njk', { title: 'Login - Worship Presneter' });
}

export function renderSignup(req, res, next) {
  res.render('pages/signup.njk', { title: 'Sign Up- Worship Presneter' });
}
