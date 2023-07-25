const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const sanitize = require('express-mongo-sanitize');

require('dotenv').config();
require('./infra/db');


const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const portalRouter = require('./routes/portal');
const homeRouter = require('./routes/home');
const apiRouter = require('./routes/api');

const AuthenticationService = require('./services/authenticationService');
const usersService = require('./services/usersService');
const authenticate = new AuthenticationService(usersService);

const methodOverride = require('method-override');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(sanitize());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// initialize passport through the authenticationService which also configures strategies
app.use(authenticate.initialize());
app.use(authenticate.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  // TIL res.locals.debug is a reserved property name
  res.locals.debugMode = process.env.DEBUG_MODE === 'true';
  res.locals.autoValidate = process.env.AUTO_VALIDATE === 'true';
  if(res.locals.autoValidate){
    res.locals.autoValidateTimeout = parseInt(process.env.AUTO_VALIDATE_TIMEOUT);
  }
  next();
});

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/portal',portalRouter);
app.use('/portal/home',homeRouter);
app.use('/portal/api',apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
