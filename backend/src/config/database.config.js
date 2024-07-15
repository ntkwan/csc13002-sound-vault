require('dotenv').config();
const mongoose = require('mongoose');

async function connect_database() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database is connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

module.exports = { connect_database };
