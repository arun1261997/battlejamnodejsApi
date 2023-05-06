import { Router } from 'express';
import * as controller from '../controllers/genre.js';
import * as validation from '../validations/genre.js';
import validate from '../middleware/validate.js';
import checkAuth from '../middleware/checkAuth.js';
import fileupload from '../middleware/fileupload.js';

const router = Router();

router
  .route('/')
  .get(controller.getGenreList)
  .post(
    fileupload.auto('image'),
    validate(validation.createGenre),
    controller.createGenre
  );

router
  .route('/:id')
  .get(controller.getGenreById)
  .patch(
    fileupload.auto('image'),
    validate(validation.updateGenre),
    controller.updateGenre
  )
  .delete(controller.deleteGenre);

export default router;
