import passport from 'passport';
import localStrategy from './localStrategy.js';
import { prisma } from '../lib/prisma.js';

export default () => {
  passport.serializeUser((user, done) => {
    // console.log('serializeUser', user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    // console.log('deserializeUser', id);
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      const { password, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  localStrategy();
};
