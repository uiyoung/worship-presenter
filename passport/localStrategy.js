const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          const exUser = await prisma.user.findUnique({ where: { email } });
          if (!exUser) {
            return done(null, false, { message: 'Invalid username or password.' });
          }

          const result = await bcrypt.compare(password, exUser.password);
          if (!result) {
            return done(null, false, { message: 'Invalid username or password.' });
          }

          return done(null, exUser);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
