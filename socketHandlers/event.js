import Event from '../models/event.js';
import Round from '../models/round.js';
import { startChannel } from '../services/gcp.js';

const turnIntervals = {};
const checkIntervals = {};

const onStart = (io, round) => {
  let lastTurn = 'B';

  turnIntervals[round.id] = setInterval(() => {
    const currentTurn = lastTurn === 'A' ? 'B' : 'A';
    io.in(round.event.toString()).emit('round-turn', {
      user: currentTurn,
    });
    lastTurn = currentTurn;
  }, 1000 * 15);

  checkIntervals[round.id] = setInterval(async () => {
    const data = await Round.findById(round._id);
    if (!data) return;

    if (data.performerA.voteCount === data.performerB.voteCount) {
      // tie, let interval to continue;
    } else {
      const winner =
        data.performerA.voteCount > data.performerB.voteCount
          ? data.performerA.id
          : data.performerB.id;

      await Round.updateOne(
        { _id: data._id },
        {
          winner,
        }
      );

      clearInterval(turnIntervals[round.id]);
      clearInterval(checkIntervals[round.id]);
      io.in(data.event.toString(), {
        event: 'round-end',
        winner: winner,
      });
    }
  }, 1000 * 60 * 2);
};

export default async function (socket, io) {
  const event = await Event.findById(socket.handshake.query.eventId).lean();
  if (!event) return;

  const round = await Round.findOne({ event: event._id, status: 'active' })
    .populate('performerA.id')
    .populate('performerB.id')
    .lean();

  socket.join(event._id.toString());

  socket.emit('event-data', {
    active: !!round,
    performerA: {
      userName: round?.performerA.id.fullName,
      streamUri: process.env.GCP_BUCKET_URL + event.performerA.streamUri,
    },
    performerB: {
      userName: round?.performerB.id.fullName,
      streamUri: process.env.GCP_BUCKET_URL + event.performerB.streamUri,
    },
  });

  socket.on('join-event', async (data) => {
    const [event, pendingRound, anyRoundExists] = await Promise.all([
      Event.findById(data.id),
      Round.findOne({ event: data.id, status: 'pending' }).populate(
        'performerA.id'
      ),
      Round.exists({ event: data.id }),
    ]);

    if (!event) return;

    if (pendingRound) {
      pendingRound.performerB = {
        id: socket.data.user._id,
      };
      pendingRound.status = 'active';
      await pendingRound.save();
      await socket.join(pendingRound.id);

      try {
        await Promise.all([
          startChannel(event.performerA.channel),
          startChannel(event.performerB.channel),
        ]);
      } catch (err) {
        console.error(err);
      }

      socket.emit('round-start', {
        roundId: pendingRound._id,
        rtmp: event.performerB.rtmp,
      });

      socket.in(pendingRound.id).emit('round-start', {
        roundId: pendingRound._id,
        rtmp: event.performerA.rtmp,
      });

      io.in(event._id.toString()).emit('event-data', {
        active: true,
        roundId: pendingRound.id,
        performerA: {
          userName: pendingRound?.performerA.id.fullName,
          streamUri: process.env.GCP_BUCKET_URL + event.performerA.streamUri,
        },
        performerB: {
          userName: socket.data.user.fullName,
          streamUri: process.env.GCP_BUCKET_URL + event.performerB.streamUri,
        },
      });
      console.log('event data emitted when round starts');

      //onStart(io, pendingRound);
    } else {
      const newRound = await Round.create({
        event: event._id,
        [anyRoundExists ? 'performerB' : 'performerA']: {
          id: socket.data.user._id,
        },
        status: 'pending',
      });

      await socket.join(newRound.id);
    }

    socket.join(event._id);
    socket.emit('round-joined');
  });

  socket.on('vote', (data) => {});

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
}
