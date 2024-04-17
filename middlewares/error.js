export function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, req, res, next) {
  // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // res.status(statusCode);
  // res.json({
  //   message: err.message,
  //   stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  // });
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('pages/error.njk', { title: 'error - Worship Presenter' });
}
