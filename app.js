require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

//imported routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//imported mongoose models
const usersModel = require('./models/usersModel');

const app = express();
const PORT = process.env.PORT || 3000;
let db;

//mongoDB connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
db = mongoose.connection
db.on('error', e => console.log('error:', e))
db.once('open', () => {
  console.log('database connected')
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

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

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
