import mongoose from 'mongoose';
import logger from '../utils/logger.js';

mongoose.set('debug', true);
mongoose.set('toJSON', { getters: true });
mongoose.set('toObject', { getters: true });

export const connectMongoDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  logger.info('MongoDB connected');
};