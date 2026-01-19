import passport from 'passport';
import { registerLocalStrategy } from './localStrategy.js';
import { prisma } from '../lib/prisma.js';

export function initPassport() {
  registerLocalStrategy(passport);

  passport.serializeUser((user, done) => {
    // console.log('serializeUser', user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    // console.log('deserializeUser', id);
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        omit: { password: true },
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  return passport;
}
