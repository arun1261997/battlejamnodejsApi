import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken.js';

export const generateTokens = async (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  });

  await RefreshToken.create({
    user: id,
    token: refreshToken,
  });

  return {
    accessToken,
    refreshToken,
  };
};
