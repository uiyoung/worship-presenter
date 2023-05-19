const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

app.set('view engine', 'html');
nunjucks.configure('views', { autoescape: true, express: app });

const indexRouter = require('./routes');
const songRouter = require('./routes/song');

app.use(express.static('public'));
app.use(express.json());

app.use('/', indexRouter);
app.use('/song', songRouter);

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
app.listen(port, () => console.log('> Server is up and running on port : ' + port));
