if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const databaseModule = require('./config/database.config');
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
app.use(cookieParser());

// HTTP method logging
app.use(morgan('combined'));

//Routes
const authorize = require('./routes/auth.route');
const user = require('./routes/user.route');
const admin = require('./routes/admin.route');
const file_controller = require('./routes/upload.route');
const song_controller = require('./routes/song.route');
const playlist_controller = require('./routes/playlist.route');
const payment_controller = require('./routes/payment.route');
const report_controller = require('./routes/report.route');

app.use(authorize);
app.use(user);
app.use(admin);
app.use(file_controller);
app.use(song_controller);
app.use(playlist_controller);
app.use(payment_controller);
app.use(report_controller);

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
