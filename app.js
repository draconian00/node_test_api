const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
// session 을 이용한 로그인 구현
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs'); // 암호화 모듈

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// bodyParser, session
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'draconian12#@!',
  key: 'sid', // --> sid 설정이 없더라도 connect.sid 로 쿠키는 저장된다.
  // 세션 쿠키를 제어하기 위해선 설정하는게 좋을 듯
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
  }
}));
/** session middleware options
 * secret : 쿠키 암호화를 위한 필수 옵션
 * resave : 요청이 왔을때 세션을 수정하지 않더라도 세션을 다시 저장소에 저장되도록 함. 2개 이상의 병렬요청이 왔을 경우 원치 않은 저장이 이루어질 수 있으니 유의...
 * saveUninitialized : 초기화 되지 않은 세션을 강제로 저장. 모든 방문자에게 고유한 식별 값을 주는 것과 같다.
*/

// user test data

app.use('/', indexRouter);

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
