import TrackPlayer, {Event} from 'react-native-track-player';

export const PlaybackService = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteDuck, async ({permanent}) => {
    if (permanent) {
      await TrackPlayer.stop();
      return;
    }
    await TrackPlayer.pause();
  });
};
