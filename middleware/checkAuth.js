import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export default async function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.sendStatus(401);

    req.user = user;
  } catch (err) {
    return res.sendStatus(401);
  }

  next();
}
