var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var AddCategoryRouter = require('./routes/AddCategory');
var PassCategoryRouter = require('./routes/pass_category');
var AddPassRouter = require('./routes/AddPass');
var viewPassRouter = require('./routes/view_pass');
var usersRouter = require('./routes/users');
var pass_catapi = require('./api/pass-cat');
 var pro_api = require('./api/product');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/add_category', AddCategoryRouter);
app.use('/pass_category', PassCategoryRouter);
app.use('/add_pass', AddPassRouter);
app.use('/view_pass', viewPassRouter);
app.use('/users', usersRouter);

app.use('/api', pass_catapi);
  app.use('/product_api', pro_api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
