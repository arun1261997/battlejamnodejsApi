import joi from 'joi';

export const createGenre = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
});

export const updateGenre = joi.object({
  name: joi.string(),
  image: joi.string(),
});
