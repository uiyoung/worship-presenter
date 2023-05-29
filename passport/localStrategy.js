const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const users = [{ email: 'member62@naver.com', password: '1111' }];
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
      },
      (email, password, done) => {
        const user = users.find((user) => user.email === email);

        return done(null, user);
      }
    )
    //   async (email, password, done) => {
    //     try {
    //       const exUser = await User.findOne({ where: { email } });
    //       if (exUser) {
    //         const result = await bcrypt.compare(password, exUser.password);
    //         if (result) {
    //           done(null, exUser);
    //         } else {
    //           done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
    //         }
    //       } else {
    //         done(null, false, { message: '가입되지 않은 회원입니다.' });
    //       }
    //     } catch (error) {
    //       console.error(error);
    //       done(error);
    //     }
    //   }
    // )
  );
};
