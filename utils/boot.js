import dotenv from 'dotenv';
import logger from './logger.js';
import { connectMongoDB } from '../services/db.js';
import './patchExpress.js';

dotenv.config();

export default async function boot(server) {
  await connectMongoDB();
  server.listen(process.env.PORT, () => {
    logger.info(`API is listening on port ${process.env.PORT}`);
  });
}
