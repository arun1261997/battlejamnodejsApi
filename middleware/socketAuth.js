import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export default async function socketAuth(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authorization is required'));

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return next(new Error('user not found'));

    socket.data.user = user.toJSON();
  } catch (err) {
    if (!token) return next(new Error('Authorization is required'));
  }

  next();
}
