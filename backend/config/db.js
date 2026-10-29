const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Local MongoDB not reachable, starting embedded MongoDB instance...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Embedded Connected: ${conn.connection.host}`);
    } catch (innerError) {
      console.error(`Database connection error: ${innerError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
