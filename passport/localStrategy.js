import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';

export function registerLocalStrategy(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: true,
      },
      async (email, password, done) => {
        try {
          const exUser = await prisma.user.findUnique({ where: { email } });
          if (!exUser) {
            return done(null, false, {
              message: 'Invalid username or password.',
            });
          }

          const result = await bcrypt.compare(password, exUser.password);
          if (!result) {
            return done(null, false, {
              message: 'Invalid username or password.',
            });
          }

          const { password: _pw, ...userWithoutPassword } = exUser;
          return done(null, userWithoutPassword);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
}
