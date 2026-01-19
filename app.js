import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import { initPassport } from './passport/index.js';
import nunjucks from 'nunjucks';
import morgan from 'morgan';

import apiRouter from './routes/api/index.js';
import viewRouter from './routes/view/index.js';
import { notFound, errorHandler } from './middlewares/error.js';

const app = express();
const passport = initPassport();

app.set('trust proxy', 1);
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'html');
nunjucks.configure('views', { autoescape: true, express: app });

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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

app.use('/api', apiRouter);
app.use('/', viewRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(app.get('port'), () => {
  console.log('> Server is up and running on port : ' + app.get('port'));
});
