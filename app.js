var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter= require('./routes/catalog');
var compression= require('compression');
var helmet= require('helmet');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//var wiki= require('./routes')

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var mongoose= require('mongoose');
var dev_db= 'mongodb+srv://vietbk02:vietbk02@cluster0.8yaqq.mongodb.net/local_library?retryWrites=true&w=majority';
var mongoDB= process.env.MONGODB_URI || dev_db
mongoose.connect(mongoDB, {useNewUrlParser: true,useUnifiedTopology: true});
var db= mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error'));
db.on('open', function(err){
  if (err) throw err;
  console.log("connected");
})

/* var Schema= mongoose.Schema;
var SomeModelSchema= new Schema({
  a_string: String,
  a_date: Date
});
var SomeModel= mongoose.model('SomeModel', SomeModelSchema);
var awesome_instance1= new SomeModel({name: 'awesome1'});
awesome_instance1.save(function(err){
  if (err) throw err;
  console.log('1 document addes');
})
SomeModel.create({name: 'also_awesome1'}, function(err,awesome_instance2){
  if (err) throw err;
  console.log('1 more added');
})
console.log(awesome_instance1.name); */
module.exports = app;
