if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

const databaseModule = require('./database');
const errorLogging = require('http-errors');

const port = process.env.PORT;
const app = express();

databaseModule.connect_database();
app.use(
    cors({
        origin: process.env.CLIENT_URI,
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP method logging
app.use(morgan('combined'));

//Routes
const authorize = require('./routes/auth.route');
const user = require('./routes/user.route');

app.use(authorize);
app.use(user);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error handling
app.use((req, res, next) => {
    next(errorLogging.NotFound('This page does not exists'));
});

app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message,
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
