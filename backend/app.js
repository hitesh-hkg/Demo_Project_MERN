var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var productRouter = require('./routes/productRouter');
var userRouter = require('./routes/userRouter');
const cors = require('cors');
const fs = require('fs');


var app = express();


app.use(cors({credentials:true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', productRouter);
app.use('/', userRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if(req.file && fs.existsSync(req.file.path)){
    fs.rmSync(req.file.path);
    console.log("files deleted");
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.stack);
  res.type('json').status(err.statusCode||500).send(err.message);
});


module.exports = app;

