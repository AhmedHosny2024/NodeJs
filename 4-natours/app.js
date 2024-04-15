const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware (middle between request and response)
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes
app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
// Start server
