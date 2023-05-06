import mongoose from 'mongoose';
import { getS3Url } from '../services/s3.js';

const performerSchema = {
  input: String,
  channel: String,
  rtmp: String,
  streamUri: String,
};

const schema = new mongoose.Schema(
  {
    name: String,
    image: {
      type: String,
      get: getS3Url,
    },
    startDate: Date,
    performerA: performerSchema,
    performerB: performerSchema,
    status: {
      type: String,
      enum: ['pending', 'started', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('event', schema);

export default Event;
