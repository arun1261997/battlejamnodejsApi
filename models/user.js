import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const schema = new mongoose.Schema(
  {
    fullName: String,
    nickName: { type: String, unique: true },
    phoneNumber: String,
    email: { type: String, unique: true },
    password: String,
    about: String,
    age: Number,
    stageName: String,
    performerAbout: String,
    viewerPreferences: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'genre',
      },
    ],
    performerPreferences: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'genre',
      },
    ],
    isPerformer: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ email: 1 });
schema.index({ phoneNumber: 1 });
schema.index({ isPerformer: 1 });

schema.methods.verifyPassword = function (password) {
  const isValid = bcrypt.compareSync(password, this.password);
  return isValid;
};

schema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

const User = mongoose.model('user', schema);

export default User;
