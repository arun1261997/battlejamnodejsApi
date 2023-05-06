import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import User from '../models/user.js';
import Verification from '../models/verification.js';
import RefreshToken from '../models/refreshToken.js';
import { generateTokens } from '../services/jwt.js';
import { sendEmail } from '../services/email.js';
import { response } from 'express';

export const sendOTP = async (req, res) => {
  const otp = cryptoRandomString({
    type: 'numeric',
    length: 6,
  });

  await Verification.create({
    email: req.user.email,
    otp,
  });

  sendEmail({
    to: req.user.email,
    subject: 'Verify email',
    content: `Hey, \n\n${otp} is the OTP to authenticate your email`,
  });

  res.sendStatus(200);
};

export const verifyOTP = async (req, res) => {
  const verification = await Verification.findOne({
    email: req.user.email,
  }).sort('-createdAt');

  if (!verification || verification.otp !== req.body.otp) {
    return res.status(400).json({
      message: 'Invalid OTP',
    });
  }

  await verification.remove();
  await User.updateOne({ email: req.user.email }, { isVerified: true });

  res.sendStatus(200);
};

export const register = async (req, res) => {
  const user = new User(req.body);

  await user.save();
  const tokens = await generateTokens(user._id);

  res.status(201).json({
    data: user.toJSON(),
    ...tokens,
  });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return res.status(404).json({
      message: 'user not found',
    });

  if (!user.verifyPassword(req.body.password)) {
    return res.status(400).json({
      message: 'Invalid password',
    });
  }

  const tokens = await generateTokens(user._id);

  res.status(200).json({
    data: user.toJSON(),
    ...tokens,
  });
};

export const refreshToken = async (req, res) => {
  try {
    const payload = jwt.verify(
      req.body.token,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    const data = await RefreshToken.findOne({
      token: req.body.token,
      user: payload.id,
    });

    if (!data) return res.sendStatus(400);

    await data.remove();

    const tokens = generateTokens(payload.id);

    res.status(200).json(tokens);
  } catch (err) {
    return res.sendStatus(400);
  }
};

export const checkForNickName = async (req, res) => {
  const data = await User.findOne({ nickName: req.query.name });

  if (data) return res.sendStatus(400);

  return res.sendStatus(200);
};
