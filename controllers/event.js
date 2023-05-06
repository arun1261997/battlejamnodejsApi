import dayjs from 'dayjs';
import customFormat from 'dayjs/plugin/customParseFormat.js';
import Event from '../models/event.js';
import { createChannel, createInput } from '../services/gcp.js';

dayjs.extend(customFormat);

export const createEvent = async (req, res) => {
  const data = new Event(req.body);

  data.startDate = dayjs(req.body.startDate, 'YYYY-MM-DD').toDate();

  data.performerA = {
    input: `event-${data.id}-performer-a`,
    channel: `event-${data.id}-performer-a`,
  };

  data.performerB = {
    input: `event-${data.id}-performer-b`,
    channel: `event-${data.id}-performer-b`,
  };

  const [inputA, inputB] = await Promise.all([
    createInput(data.performerA.input),
    createInput(data.performerB.input),
  ]);

  const [channelA, channelB] = await Promise.all([
    createChannel({
      id: data.performerA.channel,
      inputId: data.performerA.input,
    }),
    createChannel({
      id: data.performerB.channel,
      inputId: data.performerB.input,
    }),
  ]);

  data.performerA.rtmp = inputA.uri;
  data.performerB.rtmp = inputB.uri;

  data.performerA.streamUri = channelA.streamUri;
  data.performerB.streamUri = channelB.streamUri;

  await data.save();

  res.status(201).json(data);
};

export const getEvents = async (req, res) => {
  const data = await Event.find();

  res.json(data);
};

export const getEventById = async (req, res) => {
  const data = await Event.findById(req.params.id);
  if (!data) return res.sendStatus(404);

  res.json(data);
};

export const updateEvent = async (req, res) => {
  const data = await Event.findById(req.params.id);
  if (!data) return res.sendStatus(404);

  Object.assign(data, req.body);

  if (req.body.startDate) {
    data.startDate = dayjs(req.body.startDate, 'YYYY-MM-DD').toDate();
  }

  await data.save();

  res.status(200).json(data);
};

export const deleteEvent = async (req, res) => {
  const data = await Event.findById(req.params.id);
  if (!data) return res.sendStatus(404);

  await data.save();

  res.sendStatus(200);
};
