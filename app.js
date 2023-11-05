const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();


const db = require('./db');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const schedulesRouter = require('./routes/schedules');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

db.connect().catch(console.dir);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/schedules', schedulesRouter);

module.exports = app;
