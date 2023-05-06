import joi from 'joi';

export const updateProfile = joi.object({
  fullName: joi.string(),
  nickName: joi.string(),
  about: joi.string(),
  age: joi.number(),
  stageName: joi.string(),
  performerAbout: joi.string(),
  viewerPreferences: joi.array().items(joi.string()),
  performerPreferences: joi.array().items(joi.string()),
});

export const setPreferences = joi.object({
  ids: joi.array().items(joi.string()).required(),
});
