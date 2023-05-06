import { v1 } from '@google-cloud/livestream';

const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_REGION;
const outputUri = 'gs://battle-jams-streams/outputs/';

const client = new v1.LivestreamServiceClient();
const parent = client.locationPath(projectId, location);

export const createInput = async (id) => {
  const request = {
    parent,
    inputId: id,
    input: {
      type: 'RTMP_PUSH',
    },
  };

  const [operation] = await client.createInput(request);
  const response = await operation.promise();
  const [input] = response;

  return input;
};

export const getInput = async (id) => {
  const [res] = await client.getInput({
    name: client.inputPath(projectId, location, id),
  });

  return res;
};

export const deleteInput = async (id) => {
  await client.deleteInput({ name: client.inputPath(projectId, location, id) });
};

export const createChannel = async ({ id, inputId }) => {
  const streamUri = `${id}-manifest.m3u8`;

  const request = {
    parent,
    channelId: id,
    channel: {
      inputAttachments: [
        {
          key: inputId,
          input: client.inputPath(projectId, location, inputId),
        },
      ],
      output: {
        uri: outputUri,
      },
      elementaryStreams: [
        {
          key: 'es_video',
          videoStream: {
            h264: {
              profile: 'high',
              heightPixels: 720,
              widthPixels: 1280,
              bitrateBps: 3000000,
              frameRate: 30,
            },
          },
        },
        {
          key: 'es_audio',
          audioStream: {
            codec: 'aac',
            channelCount: 2,
            bitrateBps: 160000,
          },
        },
      ],
      muxStreams: [
        {
          key: 'mux_video',
          elementaryStreams: ['es_video'],
          segmentSettings: {
            seconds: 2,
          },
        },
        {
          key: 'mux_audio',
          elementaryStreams: ['es_audio'],
          segmentSettings: {
            seconds: 2,
          },
        },
      ],
      manifests: [
        {
          fileName: streamUri,
          type: 'HLS',
          muxStreams: ['mux_video', 'mux_audio'],
          maxSegmentCount: 5,
        },
      ],
    },
  };

  const [operation] = await client.createChannel(request);
  const response = await operation.promise();
  const [channel] = response;

  return {
    ...channel,
    streamUri,
  };
};

export const startChannel = async (id) => {
  const request = {
    name: client.channelPath(projectId, location, id),
  };
  const [operation] = await client.startChannel(request);
  await operation.promise();
};

export const stopChannel = async (id) => {
  const request = {
    name: client.channelPath(projectId, location, id),
  };
  const [operation] = await client.stopChannel(request);
  await operation.promise();
};

export const getChannel = async (id) => {
  const request = {
    name: client.channelPath(projectId, location, id),
  };

  const [res] = await client.getChannel(request);

  return res;
};

export const deleteChannel = async (id) => {
  await client.deleteChannel({
    name: client.channelPath(projectId, location, id),
  });
};

export const cleanUp = async () => {
  const [channels] = await client.listChannels({ parent });
  const [inputs] = await client.listInputs({ parent });

  for (const channel of channels) {
    await client.deleteChannel({ name: channel.name });
  }

  for (const input of inputs) {
    await client.deleteInput({ name: input.name });
  }

  console.log('cleaned up successfully');
};

// stopChannel('event-6385d7729e1e5d8df9a29ac1-performer-b');
// stopChannel('event-6385d7729e1e5d8df9a29ac1-performer-a');
// getChannel('event-6385d7729e1e5d8df9a29ac1-performer-b').then(console.log);
