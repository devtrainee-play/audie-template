import {useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity, View, Platform} from 'react-native';
import Video, {OnBufferData} from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import {ChevronLeft, Volume2, VolumeX} from 'lucide-react-native';
import {NavigationProp} from '@react-navigation/native';
import {useUrls} from '@/services/api/get-url';
import {VLCPlayer} from 'react-native-vlc-media-player';
import Toast from 'react-native-toast-message';

interface TVProps {
  navigation: NavigationProp<RootTabParamList>;
}

export const TV: React.FC<TVProps> = ({navigation}) => {
  const {data} = useUrls();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [urlStream, setUrlStream] = useState<string>('');
  const [isStoped, setIsStoped] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(60);
  const videoRef = useRef<any>(null);
  const isAndroidPlatform = Platform.OS === 'android';

  useEffect(() => {
    Orientation.lockToLandscape();

    if (isStoped) {
      navigation.navigate('Home');
    }

    return () => {
      Orientation.lockToPortrait();
    };
  }, [isStoped]);

  useEffect(() => {
    if (data) {
      const urlStream = data.find(({urls}: any) => urls.typeId == 12).urls.url;
      setUrlStream(urlStream);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (videoRef.current) {
        videoRef.current.seek(0);
        videoRef.current.dismissFullscreenPlayer?.();
      }
    });

    return () => {
      if (videoRef.current) {
        videoRef.current.seek(0);
        videoRef.current.dismissFullscreenPlayer?.();
        videoRef.current = null;
      }

      unsubscribe();
    };
  }, [navigation]);

  function onBuffer(data: OnBufferData) {
    console.log(data);
  }

  function onError(error: any) {
    console.log(error);

    Toast.show({
      type: 'error',
      text1: 'Erro ao acessar a Tv',
      text2: 'Por favor, cheque seu streaming',
    });

    navigation.goBack();
  }

  function handleLoad(load: any) {
    console.log(load);
    setIsLoading(true);
  }

  function handleAudio() {
    setIsMuted(!isMuted);
  }

  function stopLive() {
    if (isAndroidPlatform) {
      navigation.goBack();
    } else {
      setVolume(0), setIsStoped(true);
    }
  }

  return (
    <>
      <View className="relative flex items-center justify-center w-full h-full">
        <View
          className={`absolute z-10 flex items-center justify-center w-full h-full bg-black/50 ${
            isLoading && 'hidden'
          }`}>
          <View className="">
            <Text className="text-black">Carregando...</Text>
          </View>
        </View>
        <View className="relative w-full h-full">
          {isLoading && (
            <>
              <View className="absolute z-50 left-5 top-5">
                <View className="flex flex-row items-center gap-0 p-0 m-0 bg-gray-700/50 rounded-xl">
                  <TouchableOpacity
                    onPress={stopLive}
                    className="flex items-center justify-center p-3 px-4">
                    <ChevronLeft color={'white'} size={20} />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="absolute z-50 right-5 top-5 bg-gray-800/40 rounded-xl">
                {isMuted ? (
                  <TouchableOpacity
                    onPress={handleAudio}
                    className="flex items-center justify-center p-3 px-4 ">
                    <VolumeX color={'white'} size={20} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleAudio}
                    className="flex items-center justify-center p-3 px-4 ">
                    <Volume2 color={'white'} size={20} />
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
          {urlStream != '' &&
            (isAndroidPlatform ? (
              <Video
                source={{uri: urlStream}}
                onBuffer={onBuffer}
                onError={onError}
                onLoad={handleLoad}
                ref={videoRef}
                muted={isMuted}
                fullscreen
                resizeMode="stretch"
                className="w-full h-full"
              />
            ) : (
              <VLCPlayer
                videoAspectRatio="16:9"
                style={{width: '100%', height: '100%'}}
                onError={e => onError(e)}
                muted={isMuted}
                ref={videoRef}
                onLoad={handleLoad}
                paused={isStoped}
                volume={volume}
                playInBackground={false}
                source={{uri: urlStream}}
              />
            ))}
        </View>
      </View>
    </>
  );
};
