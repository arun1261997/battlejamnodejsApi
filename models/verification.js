import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    email: String,
    otp: String,
  },
  { timestamps: true }
);

schema.index({ email: 1 });

const Verification = mongoose.model('verification', schema);

export default Verification;
