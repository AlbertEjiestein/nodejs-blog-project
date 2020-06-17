var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);  // redis服务存放session

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user')

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 日志记录
const ENV = process.env.NODE_ENV
if(ENV !== 'production'){
  app.use(logger('dev', {
    stream: process.stdout
  }))
}else{
  const logFileName = path.join(__dirname, './logs/access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined',{
    stream: writeStream
  }))
}
app.use(express.json()); // 解析post数据
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // 解析cookie
// app.use(express.static(path.join(__dirname, 'public')));

const redisClient = require('./db/redis') // redis客户端配置信息
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'Wsdfjs_123#',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

// 注册路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
