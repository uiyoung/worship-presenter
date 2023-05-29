const passport = require('passport');
const local = require('./localStrategy');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('serialize');
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('deserialize');
    done(null, id);
  });

  local();
};
