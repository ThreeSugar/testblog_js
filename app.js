var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var helpers = require('express-helpers');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');

var blog = require('./routes/blog');

var chat = require('./routes/chat');

var app = express();
var server = require('http').createServer(app);

//ejs helpers
helpers(app);

// view engine setup
var engine = require('ejs-mate');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//database setup(mongodb)
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds151348.mlab.com:51348/ooptest')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

//express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport(for authentication)
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(require('express-session')({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//register user object (must be placed after passport.session, but before any other routes)
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/signup', signup);
app.use('/logout', logout);

app.use('/blog', blog);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//socket.io 
server.listen(5000);
const io = require('socket.io')(server);
io.on('connection', function(client){ 
    console.log('chat works') 
    client.username = "Anon"
    client.on('change_username', (data => {client.username = data.username}))

    //listen on new_message
    client.on('new_message', (data) => {
      //broadcast the new message
      io.sockets.emit('new_message', {message : data.message, username : client.username});
    })

    //listen on typing
    client.on('typing', (data) => {
    client.broadcast.emit('typing', {username : client.username})
    })
});



module.exports = app;
