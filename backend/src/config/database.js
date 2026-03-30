const mongoose = require('mongoose');

async function connectToDatabase() {
    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error details:');
        console.error('- Message:', error.message);
        console.error('- Code:', error.code);
        if (error.reason) console.error('- Reason:', error.reason);
        throw error;
    }
}

module.exports = connectToDatabase;
