import joi from 'joi';

export const sendOTP = joi.object({});

export const verifyOTP = joi.object({
  otp: joi.string().length(6).required(),
});

export const register = joi.object({
  fullName: joi.string().required(),
  nickName: joi.string().required(),
  phoneNumber: joi.string(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  about: joi.string(),
  age: joi.number(),
  stageName: joi.string(),
  performerAbout: joi.string(),
  isPerformer: joi.boolean(),
});

export const login = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const refreshToken = joi.object({
  token: joi.string().required(),
});
