import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

schema.index({ user: 1 });
schema.index({ token: 1 });

const RefreshToken = mongoose.model('refreshToken', schema);

export default RefreshToken;
