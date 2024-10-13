const routes = require('./routes');

const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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

module.exports = app;
