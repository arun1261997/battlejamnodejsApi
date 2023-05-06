import User from '../models/user.js';

export const getProfile = async (req, res) => {
  const data = await User.findById(req.user._id)
    .populate('viewerPreferences')
    .populate('performerPreferences');

  res.json(data);
};

export const updateProfile = async (req, res) => {
  const data = await User.findById(req.user._id);

  Object.assign(data, req.body);

  await data.save();
  await data.populate('viewerPreferences');
  await data.populate('performerPreferences');

  res.status(200).json(data);
};

export const deleteProfile = async (req, res) => {
  await User.deleteOne({ _id: req.user._id });

  res.sendStatus(200);
};
