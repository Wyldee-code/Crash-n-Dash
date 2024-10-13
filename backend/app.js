const routes = require('./routes');

const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { ValidationError } = require('sequelize');

// Check environment configuration
const { environment } = require('./config');
const isProduction = environment === 'production';

// Initialize the express app
const app = express();

// Use morgan for logging requests
app.use(morgan('dev'));

// Parse cookies and JSON request bodies
app.use(cookieParser());
app.use(express.json());

// Apply security middleware
if (!isProduction) {
  app.use(cors()); // enable cors in development only
}

app.use(helmet.crossOriginResourcePolicy({
  policy: "cross-origin"
}));

app.use(
    csurf({
  cookie: {
    secure: isProduction,
    sameSite: isProduction && "Lax",
    httpOnly: true
  }
}));

app.use(routes);

app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
      let errors = {};
      for (let error of err.errors) {
        errors[error.path] = error.message;
      }
      err.title = 'Validation error';
      err.errors = errors;
    }
    next(err);
});

app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
      title: err.title || 'Server Error',
      message: err.message,
      errors: err.errors,
      stack: isProduction ? null : err.stack
    });
});

module.exports = app;
