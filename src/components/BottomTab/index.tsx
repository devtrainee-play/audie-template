import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  DiscountShape,
  Home,
  Notepad2,
  PauseCircle,
  PlayCircle,
  ProfileCircle,
  Microphone2,
  Radio,
} from 'iconsax-react-native';
import {Animated, Image, Text, TouchableOpacity, View} from 'react-native';
import useBottomTabAnimation from '../../hooks/useBottomTabAnimation';
import {useEffect, useState} from 'react';
import {WaveIndicator} from 'react-native-indicators';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import {PlayerModal} from './components/PlayerModal';
import {useUrls} from '../../services/api/get-url';
import axios from 'axios';
import {Tv} from 'lucide-react-native';
import {getMetadata} from '@/services/api/get-metadata';
import xmlJs from 'xml-js';
import storage from '@/services/storage';
import {postActiveListener} from '@/services/api/post-active-listenet';
import {updateListenerStatus} from '@/services/api/post-update-listener';
import {postUserEvaluation} from '@/services/api/post-user-evaluations';
import {DISCOGS_KEY, DISCOGS_SECRET} from '@env';
import {UseGlobalStates} from '@/hooks/context';

export const BottomTab = ({navigation, state}: BottomTabBarProps) => {
  const {data} = useUrls();
  const {translateValue} = useBottomTabAnimation();
  const [isShowPlayer, setShowPlayer] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isOnLive, setIsOnLive] = useState<boolean>(true);
  const [isComercial, setIsComercial] = useState<boolean>(true);
  const [evaluation, setEvaluation] = useState<number>(3);
  const [infoMusic, setInfoMusic] = useState<{
    title: string;
    artist: string;
    coverImg: string;
    mD5: string;
  }>({artist: '', title: '', coverImg: '', mD5: ''});
  const person = storage.getPerson();
  const {authPod, isPodcast, title, urlPod, cover, setIsPodcast} =
    UseGlobalStates();
  const [isCurrentComercial, setIsCurrentComercial] = useState(false);

  useEffect(() => {
    if (data) {
      const urlStream = data.find(({urls}: any) => urls.typeId == 1).urls.url;
      if (!isPodcast) {
        LoadAudio(urlStream);
      }
    }
  }, [data, isPodcast]);

  useEffect(() => {
    if (isPodcast) {
      setPodcast();
    }
  }, [urlPod, isPodcast]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    function fetchAndSchedule() {
      getMetadata()
        .then(response => {
          if (person) {
            getUserEvaluations();
          }
          LoadMetadata(response);
          const parsed = xmlJs.xml2js(response, {compact: true}) as PlaylistXML;
          const schedTime =
            parsed.Playlist.Next.NextIns.Ins[0]._attributes.SchedTime;
          const timeOut = scheduleTimeout(schedTime);
          if (timeOut > 0) {
            timeoutId = setTimeout(fetchAndSchedule, timeOut);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

    fetchAndSchedule();

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (person) {
      getUserEvaluations();
    }
  }, [infoMusic]);

  function getUserEvaluations() {
    const payload = {
      personId: person!.id,
      mD5: infoMusic.mD5,
    };
    postUserEvaluation(payload)
      .then(({evaluation}) => {
        setEvaluation(evaluation);
      })
      .catch(error => {
        setEvaluation(3);
        console.log(error);
      });
  }

  function scheduleTimeout(schedTime: string) {
    const schedTimeFormated = new Date(convertDate(schedTime));
    const now = new Date();
    now.setHours(now.getHours() - 3);
    const timeDifference = schedTimeFormated.getTime() - now.getTime();
    return timeDifference;
  }

  function convertDate(val: string) {
    const splitTime = val.split(' ');
    const splitDate = splitTime[0].split('/');
    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}T${splitTime[1]}`;
  }

  async function initializerPlayer() {
    if (!isInitialized) {
      await TrackPlayer.setupPlayer();
      TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause],
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
      });
      setIsInitialized(true);
    }
  }

  async function setPodcast() {
    try {
      await initializerPlayer();
      await TrackPlayer.load({
        title: title,
        url: urlPod,
      });

      await TrackPlayer.play();
      setIsPlaying(true);
    } catch (e) {
      console.log(e);
    }
  }

  async function getInfoMusic(albumTitle: string, artistName: string) {
    const artist = encodeURIComponent(artistName);
    const album = encodeURIComponent(albumTitle);
    const DISCOGS_BASE_URL = 'https://api.discogs.com/database/search';

    const url = `${DISCOGS_BASE_URL}?q=${album}&artist=${artist}&type=release&key=${DISCOGS_KEY}&secret=${DISCOGS_SECRET}`;

    await axios
      .get(url)
      .then(({data}) => {
        if (data.results.length > 0) {
          const coverImg = data.results[0].cover_image;
          setInfoMusic(state => ({
            ...state,
            coverImg: coverImg,
          }));
        } else {
          setInfoMusic(state => ({
            ...state,
            coverImg: '',
          }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  async function LoadMetadata(xmlData: any) {
    try {
      if (xmlData) {
        const parsed = xmlJs.xml2js(xmlData, {compact: true}) as PlaylistXML;
        const currentMusic = parsed.Playlist.OnAir.CurMusic;
        if (parsed.Playlist.OnAir.Break.Type._text != 'C') {
          const title = currentMusic.Title._text
            ? currentMusic.Title._text
            : '';
          const artist = currentMusic.Artist._text
            ? currentMusic.Artist._text
            : '';
          const album = currentMusic.Album?._text
            ? currentMusic.Album._text
            : '';
          const mD5 = parsed.Playlist.OnAir.CurIns.MD5._text;
          await getInfoMusic(album, artist);
          setIsComercial(false);
          setIsCurrentComercial(false);
          return setInfoMusic(state => ({
            ...state,
            title,
            artist,
            mD5,
          }));
        }
      }
      setIsComercial(true);
      setIsCurrentComercial(true);
    } catch (error) {
      console.log(error);
      setIsComercial(true);
      setIsCurrentComercial(true);
    }
  }

  async function LoadAudio(urlStream: string) {
    setIsLoading(true);
    try {
      await initializerPlayer();
      await TrackPlayer.load({
        title: 'Audie Template',
        url: urlStream,
      });
      setIsLoading(false);
      setIsLoaded(true);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  async function PlayAudio() {
    await TrackPlayer.play();
    setIsPlaying(true);
    sendListener();
  }

  async function PauseAudio() {
    await TrackPlayer.pause();
    setIsPlaying(false);
    setIsOnLive(false);
    updateStatusListener();
  }

  async function sendListener() {
    const postData = {personId: person ? person.id : null};

    postActiveListener(postData)
      .then(({listenerId}) => {
        storage.saveListener(listenerId);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async function updateStatusListener() {
    const listener = storage.getListener();

    updateListenerStatus(listener)
      .then(() => {
        storage.saveListener(null);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function handlerShowPlayer() {
    setShowPlayer(!isShowPlayer);
  }

  async function handleRadioBack() {
    try {
      await TrackPlayer.remove(0);
      setIsPodcast(false);
      if (isCurrentComercial) {
        setIsComercial(true);
      }
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
  }

  function goTo(route: string, isCurrentRoute: boolean) {
    if (route != 'Television') {
      if (route === 'Podcast') {
        if (isCurrentRoute) {
          navigation.navigate('MainPodcast');
          return;
        }
        navigation.navigate('Podcast');
        return;
      }
      navigation.navigate(route);
      return;
    }
    navigation.navigate('TV');
  }

  const getIconComponent = (routeName: RouteName, isCurrentRoute: boolean) => {
    switch (routeName) {
      case 'Home':
        return (
          <View className="flex flex-col items-center justify-center space-y-1">
            <Home
              size={32}
              color={isCurrentRoute ? '#005CC7' : 'grey'}
              variant={isCurrentRoute ? 'Bold' : 'Outline'}
            />
            <Text
              className={`text-xs ${
                isCurrentRoute ? 'text-base-primary' : 'text-neutral-500'
              }`}>
              Início
            </Text>
          </View>
        );
      case 'Promotions':
        return (
          <View className="flex flex-col items-center justify-center space-y-1">
            <DiscountShape
              size={32}
              color={isCurrentRoute ? '#005CC7' : 'grey'}
              variant={isCurrentRoute ? 'Bold' : 'Outline'}
            />
            <Text
              className={`text-xs ${
                isCurrentRoute ? 'text-base-primary' : 'text-neutral-500'
              }`}>
              Promoções
            </Text>
          </View>
        );
      case 'Television':
        return (
          <View className="flex flex-col items-center justify-center space-y-1">
            <Tv size={32} color={isCurrentRoute ? '#005CC7' : 'grey'} />
            <Text
              className={`text-xs ${
                isCurrentRoute ? 'text-base-primary' : 'text-neutral-500'
              }`}>
              TV
            </Text>
          </View>
        );
      case 'News':
        return (
          <View className="flex flex-col items-center justify-center space-y-1">
            <Notepad2
              size={32}
              color={isCurrentRoute ? '#005CC7' : 'grey'}
              variant={isCurrentRoute ? 'Bold' : 'Outline'}
            />
            <Text
              className={`text-xs ${
                isCurrentRoute ? 'text-base-primary' : 'text-neutral-500'
              }`}>
              Notícias
            </Text>
          </View>
        );
      case 'Podcast':
        return (
          <View className="flex flex-col items-center justify-center space-y-1">
            <Microphone2
              size={32}
              color={isCurrentRoute ? '#005CC7' : 'grey'}
              variant={isCurrentRoute ? 'Bold' : 'Outline'}
            />
            <Text
              className={`text-xs ${
                isCurrentRoute ? 'text-base-primary' : 'text-neutral-500'
              }`}>
              PodCasts
            </Text>
          </View>
        );
      case 'ProfileUser':
        return (
          <View className="flex flex-col items-center justify-center space-y-1">
            <ProfileCircle
              size={32}
              color={isCurrentRoute ? '#005CC7' : 'grey'}
              variant={isCurrentRoute ? 'Bold' : 'Outline'}
            />
            <Text
              className={`text-xs ${
                isCurrentRoute ? 'text-base-primary' : 'text-neutral-500'
              }`}>
              Ouvinte
            </Text>
          </View>
        );
    }
  };

  return (
    <>
      <Animated.View
        style={{transform: [{translateY: translateValue}]}}
        className={`absolute bg-white bottom-2 left-5 right-5 rounded-xl shadow-2xl shadow-slate-300 dark:shadow-transparent dark:bg-background-dark2`}>
        <TouchableOpacity
          disabled={isLoading}
          onPress={handlerShowPlayer}
          activeOpacity={1}>
          <View className="flex flex-row items-center w-full px-2 space-x-2">
            {isComercial && !isPodcast ? (
              <>
                <View className="relative w-20 h-20">
                  <Image
                    className="absolute rounded-md left-2 h-14 w-14 top-4"
                    source={require('../../assets/logo.png')}
                  />
                </View>
                <View className="flex flex-col w-[60%] overflow-hidden">
                  <Text className="text-base font-medium text-black dark:text-white">
                    Audie Template
                  </Text>
                </View>
              </>
            ) : isPodcast ? (
              <>
                <View className="relative w-20 h-20">
                  {cover == '' ? (
                    <Image
                      className="absolute rounded-md left-2 h-14 w-14 top-4"
                      source={require('../../assets/logo.png')}
                    />
                  ) : (
                    <Image
                      className="absolute rounded-md left-2 h-14 w-14 top-4"
                      source={{uri: cover}}
                    />
                  )}
                </View>
                <View className="flex flex-col w-[60%] overflow-hidden">
                  <Text className="text-sm font-medium text-black dark:text-white">
                    {title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    className="text-xs font-normal text-neutral-400">
                    {authPod}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View className="relative w-20 h-20">
                  {infoMusic.coverImg == '' ? (
                    <Image
                      className="absolute rounded-md left-2 h-14 w-14 top-4"
                      source={require('../../assets/logo.png')}
                    />
                  ) : (
                    <Image
                      className="absolute rounded-md left-2 h-14 w-14 top-4"
                      source={{uri: infoMusic.coverImg}}
                    />
                  )}
                </View>
                <View className="flex flex-col w-[60%] overflow-hidden">
                  <Text className="text-sm font-medium text-black dark:text-white">
                    {infoMusic.title}
                  </Text>
                  <Text
                    numberOfLines={2}
                    className="text-xs font-normal text-neutral-400">
                    {infoMusic.artist}
                  </Text>
                </View>
              </>
            )}
            {isLoading ? (
              <View>
                <WaveIndicator
                  size={40}
                  count={2}
                  waveFactor={0.3}
                  color="white"
                />
              </View>
            ) : isPlaying && isPodcast ? (
              <View className="flex flex-col justify-end items-end top-2">
                <TouchableOpacity
                  className=" right-2 "
                  onPress={handleRadioBack}>
                  <Radio size="40" color={'grey'} variant="Bulk" />
                </TouchableOpacity>
                <TouchableOpacity className=" right-2" onPress={PauseAudio}>
                  <PauseCircle size="40" color={'grey'} variant="Bulk" />
                </TouchableOpacity>
              </View>
            ) : !isPlaying && isPodcast ? (
              <View className="flex flex-col justify-end items-end top-2">
                <TouchableOpacity
                  className=" right-2"
                  onPress={handleRadioBack}>
                  <Radio size="40" color={'grey'} variant="Bulk" />
                </TouchableOpacity>
                <TouchableOpacity className=" right-2" onPress={PlayAudio}>
                  <PlayCircle size="40" color={'grey'} variant="Bulk" />
                </TouchableOpacity>
              </View>
            ) : isPlaying ? (
              <TouchableOpacity
                className="absolute right-3"
                onPress={PauseAudio}>
                <PauseCircle size="40" color={'grey'} variant="Bulk" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="absolute right-3"
                onPress={PlayAudio}>
                <PlayCircle size="40" color={'grey'} variant="Bulk" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
        <View className="flex-row items-center justify-around flex-1 py-4">
          {state.routes.map((route, index) => {
            const isCurrentRoute = state.index === index;
            return (
              <View key={route.key}>
                <TouchableOpacity
                  onPress={() => {
                    goTo(route.name, isCurrentRoute);
                  }}
                  className="items-center justify-center flex-1">
                  {getIconComponent(route.name as RouteName, isCurrentRoute)}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </Animated.View>
      <PlayerModal
        onShowPlayer={handlerShowPlayer}
        PlayAudio={PlayAudio}
        PauseAudio={PauseAudio}
        isShowPlayer={isShowPlayer}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isLoaded={isLoaded}
        setIsLoaded={setIsLoaded}
        isOnLive={isOnLive}
        setIsOnLive={setIsOnLive}
        navigation={navigation}
        infoMusic={infoMusic}
        isComercial={isComercial}
        evaluation={evaluation}
        onUserEvaluations={getUserEvaluations}
      />
    </>
  );
};
