import Genre from '../models/genre.js';

export const createGenre = async (req, res) => {
  const data = new Genre(req.body);

  await data.save();

  res.status(201).json(data);
};

export const getGenreList = async (req, res) => {
  const data = await Genre.find();

  res.json(data);
};

export const getGenreById = async (req, res) => {
  const data = await Genre.findById(req.params.id);
  if (!data) return req.sendStatus(404);

  res.json(data);
};

export const updateGenre = async (req, res) => {
  const data = await Genre.findById(req.params.id);
  if (!data) return req.sendStatus(404);

  Object.assign(data, req.body);

  await data.save();

  res.status(200).json(data);
};

export const deleteGenre = async (req, res) => {
  const data = await Genre.findById(req.params.id);
  if (!data) return req.sendStatus(404);

  await data.remove();

  res.sendStatus(200);
};
