import { Router } from 'express';
import * as controller from '../controllers/event.js';
import * as validation from '../validations/event.js';
import validate from '../middleware/validate.js';
import auth from '../middleware/checkAuth.js';
import fileupload from '../middleware/fileupload.js';

const router = Router();

router
  .route('/')
  .get(controller.getEvents)
  .post(
    fileupload.auto('image'),
    validate(validation.createEvent),
    controller.createEvent
  );

router
  .route('/:id')
  .get(controller.getEventById)
  .patch(
    fileupload.auto('image'),
    validate(validation.updateEvent),
    controller.updateEvent
  )
  .delete(controller.deleteEvent);

export default router;
