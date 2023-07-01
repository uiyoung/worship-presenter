const express = require('express');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes');
const songRouter = require('./routes/song');
const hymnRouter = require('./routes/hymn');
const authRouter = require('./routes/auth');

const app = express();
require('dotenv').config();
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

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log('> Server is up and running on port : ' + app.get('port'));
});
