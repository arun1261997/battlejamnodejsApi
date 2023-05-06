import mongoose from 'mongoose';
import { getS3Url } from '../services/s3.js';

const schema = new mongoose.Schema(
  {
    name: String,
    image: {
      type: String,
      get: getS3Url,
    },
  },
  { timestamps: true }
);

const Genre = mongoose.model('genre', schema);

export default Genre;
