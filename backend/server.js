require('dotenv').config();
const app = require('./src/app');
const connectToDatabase = require('./src/config/database');

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
