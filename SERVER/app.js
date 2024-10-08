var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
const mongoose = require ('./Connections/Config')
var UserRouter = require('./routes/User');
var HostRouter = require('./routes/Host');
var ChatRouter = require('./routes/Chat');
var ReviewRouter = require('./routes/Review');
var AdminRouter = require('./routes/Admin');
const bodyParser = require("body-parser")
require('dotenv').config()

var app = express();


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(
  cors({
    
    origin:["https://fastcheck.shop","http://localhost:3000"],
    methods: ["GET", "POST","PUT","DELETE","PATCH"],
    credentials: true,
    
  })

)

// view engine setup
//  app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// app.use(express.raw({type: '*/*'}));
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())

app.use('/', UserRouter);
app.use('/host', HostRouter);
app.use('/chat', ChatRouter);
app.use('/review', ReviewRouter);
app.use('/admin', AdminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const port = 5000
let server = app.listen(port, () => {
  console.log(`server is running in port ${port}`);
})

// error handler  
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);

});

// app.use(express.raw());


module.exports = app;

