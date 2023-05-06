import joi from 'joi';

export const createEvent = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  startDate: joi.string().required(),
});

export const updateEvent = joi.object({
  name: joi.string(),
  image: joi.string(),
  startDate: joi.string(),
});
