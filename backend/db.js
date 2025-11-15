import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

//const mongoURL = process.env.MONGODB_URL_LOCAL;
const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB server');
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

export default db;
