import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import passportConfig from './passport/index.js';
import nunjucks from 'nunjucks';

import indexRouter from './routes/index.js';
import songRouter from './routes/song.js';
import hymnRouter from './routes/hymn.js';
import authRouter from './routes/auth.js';
import { notFound, errorHandler } from './middlewares/error.js';

const app = express();
dotenv.config();
passportConfig();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'html');
nunjucks.configure('views', { autoescape: true, express: app });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.messages = req.session.messages;
  req.session.messages = [];
  next();
});

app.use('/', indexRouter);
app.use('/song', songRouter);
app.use('/hymn', hymnRouter);
app.use('/auth', authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(app.get('port'), () => {
  console.log('> Server is up and running on port : ' + app.get('port'));
});
