import { Router } from 'express';
import * as controller from '../controllers/user.js';
import * as validation from '../validations/user.js';
import validate from '../middleware/validate.js';
import checkAuth from '../middleware/checkAuth.js';

const router = Router();

router.use(checkAuth);

router
  .route('/@me')
  .get(controller.getProfile)
  .patch(validate(validation.updateProfile), controller.updateProfile)
  .delete(controller.deleteProfile);

export default router;
