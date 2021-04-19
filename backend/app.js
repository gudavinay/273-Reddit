const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = require('./server');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// DB connection
require('./dbConnection')

// Mongo Router
const mongoRouter = require('./routes/mongo/router')
app.use('/mongoRouter', mongoRouter)

const UserProfile = require('./models/mongo/user_profile')
app.get("/", (req, res) => {
  const up = new UserProfile({ email: 'test@test.com' });
  up.save();
  res.send("Hello World");
});

// SQL router
const sqlRouter = require('./routes/sql/router')
const sqldb = require('./models/sql')
app.use('/sqlRouter', sqlRouter)
sqldb.sequelize.sync().then(() => {
    console.log('sequelize is running');
})

module.exports = app;
