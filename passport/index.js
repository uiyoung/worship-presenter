import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import localStrategy from './localStrategy.js';

const prisma = new PrismaClient();

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
