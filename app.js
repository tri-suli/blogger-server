const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

db.connect().catch(console.dir);

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
