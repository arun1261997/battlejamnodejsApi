import mongoose from 'mongoose';

const userSchema = {
  id: { type: mongoose.Types.ObjectId, ref: 'user' },
  streamUrl: String,
  voteCount: Number,
};

const schema = new mongoose.Schema(
  {
    performerA: userSchema,
    performerB: userSchema,
    winner: { type: mongoose.Types.ObjectId, ref: 'user' },
    event: { type: mongoose.Types.ObjectId, ref: 'event' },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Round = mongoose.model('round', schema);

export default Round;
