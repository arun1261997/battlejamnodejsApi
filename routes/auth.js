import { Router } from 'express';
import * as controller from '../controllers/auth.js';
import * as validation from '../validations/auth.js';
import validate from '../middleware/validate.js';
import checkAuth from '../middleware/checkAuth.js';

const router = Router();

router.post(
  '/send-otp',
  checkAuth,
  validate(validation.sendOTP),
  controller.sendOTP
);

router.post(
  '/verify-otp',
  checkAuth,
  validate(validation.verifyOTP),
  controller.verifyOTP
);

router.get('/check-nickname', controller.checkForNickName);

router.post('/register', validate(validation.register), controller.register);

router.post('/login', validate(validation.login), controller.login);

export default router;
