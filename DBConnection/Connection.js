const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Load environment variables from .env file

async function connect() {
    try {
        // Get the MongoDB connection string from environment variables
        const mongoUrl = process.env.MONGODB_URL;
        
        if (!mongoUrl) {
            throw new Error('MONGODB_URL not defined in .env file');
        }

        // Connect to MongoDB Atlas
        await mongoose.connect(mongoUrl);

        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas', err);
    }
}

module.exports = connect;
