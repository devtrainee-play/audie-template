import {
  ArrowDown2,
  Dislike,
  Like1,
  PauseCircle,
  PlayCircle,
  Radio,
} from 'iconsax-react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {MoreVertical} from 'lucide-react-native';
import {useColorScheme} from 'nativewind';
import TrackPlayer from 'react-native-track-player';
import {useState, useEffect} from 'react';
import {WaveIndicator} from 'react-native-indicators';
import {NavigationHelpers, ParamListBase} from '@react-navigation/native';
import {BottomTabNavigationEventMap} from '@react-navigation/bottom-tabs';
import {OptionsModal} from '../OptionsModal';
import axios from 'axios';
import storage from '@/services/storage';
import {postMusicEvaluation} from '@/services/api/post-music-evaluation';
import {VAGALUME_API_KEY} from '@env';
import {UseGlobalStates} from '@/hooks/context';
interface PlayerModalProps {
  onShowPlayer(): void;
  PlayAudio(): Promise<void>;
  PauseAudio(): Promise<void>;
  isShowPlayer: boolean;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoaded: boolean;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  isOnLive: boolean;
  setIsOnLive: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  infoMusic: {
    title: string;
    artist: string;
    coverImg: string;
    mD5: string;
  };
  isComercial: boolean;
  evaluation: number;
  onUserEvaluations(): void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  onShowPlayer,
  PlayAudio,
  PauseAudio,
  isShowPlayer,
  isPlaying,
  setIsPlaying,
  isLoading,
  setIsLoading,
  isLoaded,
  setIsLoaded,
  isOnLive,
  setIsOnLive,
  navigation,
  infoMusic,
  isComercial,
  evaluation,
  onUserEvaluations,
}) => {
  const {colorScheme} = useColorScheme();
  const [showOptionsPlayer, setShowOptionsPlayer] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string>('A SEGUIR');
  const [letter, setLetter] = useState<string>('');
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const person = storage.getPerson();
  const {authPod, isPodcast, setIsPodcast, title, cover} = UseGlobalStates();
  async function handleLiveAudio() {
    setIsLoading(true);
    setIsLoaded(false);
    try {
      await TrackPlayer.stop();
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
    setIsPlaying(true);
    setIsOnLive(true);
    setIsLoaded(true);
    setIsLoading(false);
  }
  async function handleRadioBack() {
    try {
      await TrackPlayer.remove(0);
      await TrackPlayer.play();
      setIsPodcast(false);
    } catch (error) {
      console.log(error);
    }
  }

  function handleShowOptionsPlayer() {
    setShowOptionsPlayer(!showOptionsPlayer);
  }

  async function handleSelectedOptions(options: string) {
    await getLetter();
    setSelectedOptions(options);
    setShowOptionsPlayer(true);
  }

  function goToTelevision() {
    onShowPlayer();
    navigation.navigate('TV');
  }

  async function getLetter() {
    const VAGALUME_BASE_URL = 'https://api.vagalume.com.br/search.php';

    const url = `${VAGALUME_BASE_URL}?art=${infoMusic.artist}&mus=${infoMusic.title}&apikey=${VAGALUME_API_KEY}`;
    await axios
      .get(url)
      .then(({data}) => {
        if (data) {
          setLetter(data.mus[0].text);
        }
      })
      .catch(error => {
        console.log('error letra >>', error);
      });
  }

  function handlerMusicEvaluation(evaluation: number) {
    const {title, artist, mD5} = infoMusic;
    const payload = {
      personId: person!.id,
      name: title,
      singer: artist,
      mD5: mD5,
      evaluation,
    };
    postMusicEvaluation(payload)
      .then(() => {
        onUserEvaluations();
      })
      .catch(error => {
        console.log(error);
      });
  }
  return (
    <>
      <Modal
        backdropTransitionOutTiming={0}
        onBackdropPress={onShowPlayer}
        onSwipeComplete={onShowPlayer}
        onBackButtonPress={onShowPlayer}
        isVisible={isShowPlayer}
        swipeDirection="down"
        className="m-0">
        <View className="flex items-start justify-between flex-1 p-5 my-3 bg-white dark:bg-background-dark2">
          <View className="flex flex-row items-center justify-between w-full">
            <TouchableOpacity onPress={onShowPlayer}>
              <ArrowDown2
                size={20}
                color={colorScheme === 'dark' ? '#FFF' : '#000'}
                variant="Outline"
              />
            </TouchableOpacity>
            {isPodcast ? (
              <View className="flex flex-row items-center justify-center mt-4 bg-gray-300 rounded-full dark:bg-background-dark">
                <View>
                  <Text className="font-medium py-1.5 px-3 text-black dark:text-white rounded-full bg-gray-100 dark:bg-background-darkLight">
                    Podcast
                  </Text>
                </View>
              </View>
            ) : (
              <View className="flex flex-row items-center justify-center mt-4 bg-gray-300 rounded-full dark:bg-background-dark">
                <View>
                  <Text className="font-medium py-1.5 px-3 text-black dark:text-white rounded-full bg-gray-100 dark:bg-background-darkLight">
                    Rádio
                  </Text>
                </View>
                <TouchableOpacity onPress={goToTelevision}>
                  <Text className="font-medium py-1.5 px-3 text-black dark:text-white rounded-full  bg-gray-300 dark:bg-background-dark">
                    TV
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity className="opacity-0">
              <MoreVertical size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex flex-col items-center justify-center w-full px-3 gap-y-3">
            {(isComercial || infoMusic.coverImg == '') && isPodcast == false ? (
              <Image
                className="flex w-[250px] h-[250px] rounded-md"
                source={require('../../../../assets/logo.png')}
              />
            ) : isPodcast ? (
              <Image
                className="h-[60%] w-full flex rounded-md"
                source={{uri: cover}}
              />
            ) : (
              <Image
                className="h-[60%] w-full flex rounded-md"
                source={{uri: infoMusic.coverImg}}
              />
            )}
            <View className="flex flex-col items-center justify-center w-full">
              {isComercial && !isPodcast ? (
                <Text className="text-xl font-medium text-black dark:text-white">
                  Audie Template
                </Text>
              ) : isPodcast ? (
                <>
                  <Text
                    numberOfLines={1}
                    className="text-xl font-semibold text-black dark:text-white">
                    {title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-sm font-normal text-neutral-800 dark:text-neutral-400">
                    {authPod}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    numberOfLines={1}
                    className="text-xl font-semibold text-black dark:text-white">
                    {infoMusic.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-sm font-normal text-neutral-800 dark:text-neutral-400">
                    {infoMusic.artist}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View className="relative flex items-center justify-center w-full mb-5">
            {isLoading ? (
              <WaveIndicator
                style={{position: 'absolute'}}
                size={100}
                count={2}
                waveFactor={0.3}
                color="white"
              />
            ) : (
              <View className="absolute">
                <View className="flex flex-row items-center justify-around w-full">
                  {person && !isComercial && (
                    <TouchableOpacity onPress={() => handlerMusicEvaluation(1)}>
                      <Like1
                        variant={`${evaluation == 1 ? 'Bulk' : 'Outline'}`}
                        size="40"
                        color={'white'}
                      />
                    </TouchableOpacity>
                  )}
                  {isPlaying ? (
                    <TouchableOpacity onPress={PauseAudio}>
                      <PauseCircle size="100" color={'grey'} variant="Bulk" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={PlayAudio}>
                      <PlayCircle size="100" color={'grey'} variant="Bulk" />
                    </TouchableOpacity>
                  )}
                  {person && !isComercial && (
                    <TouchableOpacity onPress={() => handlerMusicEvaluation(0)}>
                      <Dislike
                        variant={`${evaluation == 0 ? 'Bulk' : 'Outline'}`}
                        size="40"
                        color={'white'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
          <View>
            {isLoaded && isPodcast == false ? (
              <TouchableOpacity
                disabled={isOnLive}
                onPress={handleLiveAudio}
                className="flex flex-row items-center justify-center w-full mt-3 gap-x-1">
                <View
                  className={`p-1 rounded-full ${
                    isOnLive ? 'bg-red-600 animate-ping' : 'bg-neutral-600'
                  }`}
                />
                <Text className="font-medium text-neutral-700 dark:text-white">
                  AO VIVO
                </Text>
              </TouchableOpacity>
            ) : (
              isPodcast && (
                <TouchableOpacity
                  disabled={!isPodcast}
                  onPress={handleRadioBack}
                  className="flex flex-row items-center justify-center w-full mt-3 gap-x-1">
                  <Radio
                    size={12}
                    color={colorScheme === 'dark' ? 'gray' : 'black'}
                  />
                  <Text className="font-medium text-neutral-700 dark:text-white">
                    Voltar ao Rádio
                  </Text>
                </TouchableOpacity>
              )
            )}
            <View className="flex flex-row items-center justify-around w-full px-3 mt-7">
              {!isPodcast && (
                <TouchableOpacity
                  onPress={() => handleSelectedOptions('LETRA')}>
                  <Text className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    LETRA
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
      <OptionsModal
        onShowOptionsPlayer={handleShowOptionsPlayer}
        onSelectedOptions={handleSelectedOptions}
        PlayAudio={PlayAudio}
        PauseAudio={PauseAudio}
        showOptionsPlayer={showOptionsPlayer}
        isPlaying={isPlaying}
        isLoading={isLoading}
        selectedOptions={selectedOptions}
        infoMusic={infoMusic}
        letter={letter}
        isComercial={isComercial}
      />
    </>
  );
};
