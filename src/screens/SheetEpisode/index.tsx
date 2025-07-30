import {NavigationProp, CommonActions} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useColorScheme} from 'nativewind';
import {
  Import,
  Play,
  ArrowCircleLeft,
  TransmitSqaure2,
  TickCircle,
  RefreshCircle,
  CloseCircle,
} from 'iconsax-react-native';
import {UseGlobalStates} from '@/hooks/context';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {
  stylesDarkBody,
  stylesWhiteBody,
  stylesDarkBodyDescription,
  stylesWhiteBodyDescription,
} from '@/services/style';
import Toast from 'react-native-toast-message';
import md5 from 'crypto-js/md5';

interface SheetEpisodeProps {
  route: any;
  navigation: NavigationProp<RootTabParamList>;
}

const defaultUrl = 'https://planner.stationoffice.com.br/app/podcast/episode/';

export const SheetEpisode: React.FC<SheetEpisodeProps> = ({
  navigation,
  route,
}) => {
  const {colorScheme} = useColorScheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progressDownload, setProgressDownload] = useState(0);
  const [isFail, setIsFail] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const {
    setAuthPod,
    setIsPodcast,
    setTitle,
    setUrlPod,
    setCover,
    isShared,
    setShared,
  } = UseGlobalStates();
  const {id, auth, title, description, url, summary, duration, image, rssId} =
    route.params.episode;
  const downloadJobId = useRef<number>();
  const localPath = `${RNFS.DocumentDirectoryPath}/episodeOffline${md5(
    id,
  ).toString()}.mp3`;
  const {width} = useWindowDimensions();
  const [htmlColor, setHtmlColor] = useState({});
  const [htmlColorDesc, setHtmlColorDesc] = useState({});

  function goBack() {
    if (isShared) {
      setShared(false);
      navigation.dispatch(
        CommonActions.reset({index: 4, routes: [{name: 'MainPodcast'}]}),
      );
      return;
    }
    setShared(false);
    navigation.goBack();
  }

  async function onShare() {
    try {
      await Share.share({
        message: `Ouça esse incrível Episódio que encontrei: \n${defaultUrl}${rssId}?guid=${encodeURIComponent(
          id,
        )}`,
        title: `Ouça esse incrível Episódio que encontrei: \n${defaultUrl}${rssId}?guid=${encodeURIComponent(
          id,
        )}`,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleIsDownloaded() {
    const fileExists = await RNFS.exists(localPath);
    setIsDownloaded(false);
    if (fileExists) {
      setIsDownloaded(true);
    }
  }

  async function handleDownloadAudio() {
    try {
      setIsDownloading(true);
      if (isDownloaded) {
        console.log('Episodio ja baixado');
        setIsDownloading(false);
        setIsDownloaded(true);
        return localPath;
      }

      const options = {
        fromUrl: url,
        toFile: localPath,
        background: true,
        progressDivider: 1,
        progress: (res: any) => {
          const percentage = (res.bytesWritten / res.contentLength) * 100;
          setProgressDownload(percentage);
        },
      };

      const downloadResult = RNFS.downloadFile(options);
      downloadJobId.current = downloadResult.jobId;
      const result = await downloadResult.promise;
      if (result.statusCode === 200) {
        setIsFail(false);
        setIsDownloaded(true);
        setProgressDownload(100);

        Toast.show({
          type: 'success',
          text1: 'Episódio Baixado',
          text2: `${title}`,
        });
      } else {
        console.error(result.statusCode);
        setIsDownloaded(false);
        setIsDownloading(false);
        setIsFail(true);

        Toast.show({
          type: 'warning',
          text1: 'Falha ao baixar',
          text2: `${title}`,
        });
      }
      setIsDownloading(false);
    } catch (e) {
      if (e == 'Error: Download has been aborted') {
        Toast.show({
          type: 'info',
          text1: 'O download foi interrompido',
        });

        setIsFail(false);
        return null;
      }
      console.log(e);
      setIsDownloaded(false);
      setIsDownloading(false);
      setIsFail(true);

      Toast.show({
        type: 'warning',
        text1: 'Falha ao baixar',
        text2: `${title}`,
      });
    } finally {
      downloadJobId.current = 0;
    }
  }

  async function handleStopDownload() {
    if (downloadJobId.current) {
      RNFS.stopDownload(downloadJobId.current);
      await RNFS.unlink(localPath);
      setIsDownloading(false);
      setIsDownloaded(false);
      setIsFail(false);
    }
  }

  async function handleDeleteEpisode() {
    try {
      setIsDownloading(true);
      await RNFS.unlink(localPath);

      Toast.show({
        type: 'success',
        text1: 'Episódio Deletado',
        text2: `${title}`,
      });
      setIsDownloading(false);
      setProgressDownload(0);
      setIsDownloaded(false);
    } catch (e) {
      console.log(e);

      Toast.show({
        type: 'error',
        text1: 'Falha ao deletar episódio',
        text2: `${title}`,
      });
    }
  }

  useEffect(() => {
    handleIsDownloaded();
    if (route.params.episode) {
      setIsLoaded(true);
    }
  }, [route]);

  useEffect(() => {
    if (colorScheme === 'dark') {
      setHtmlColorDesc(stylesDarkBodyDescription);
      setHtmlColor(stylesDarkBody);
      return;
    }
    setHtmlColorDesc(stylesWhiteBodyDescription);
    setHtmlColor(stylesWhiteBody);
  }, [colorScheme]);

  async function handlePlayEpisode() {
    try {
      setAuthPod(auth);
      setTitle(title);
      if (isDownloaded) {
        setUrlPod(localPath);
      } else {
        setUrlPod(url);
      }
      setCover(image);
      setIsPodcast(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View className=" items-center justify-start min-h-screen bg-background-light dark:bg-background-dark ">
      <View className="flex flex-col w-full  justify-start">
        <View className="px-2 py-4 w-full">
          <TouchableOpacity onPress={goBack}>
            <ArrowCircleLeft className=" text-base-primary" />
          </TouchableOpacity>
        </View>
        {isLoaded ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex flex-col  px-2 py-2 mb-[300px]">
            <View className="flex flex-col w-full  items-center justify-start  bg-white dark:bg-background-darkLight rounded-lg px-2 py-2">
              <View className="h-40 w-40 ">
                <Image
                  className="w-full h-full rounded-3xl"
                  source={{uri: image}}
                />
              </View>
              <View className="mt-3">
                <Text
                  numberOfLines={2}
                  className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                  {title}
                </Text>
              </View>
              <View className="mt-3">
                <Text
                  numberOfLines={2}
                  className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                  {duration}
                </Text>
              </View>
              <View className="flex flex-row w-full items-center justify-center mt-5  gap-x-4">
                {isDownloading ? (
                  <TouchableOpacity
                    className="items-center justify-center  h-10  w-10 rounded-full  bg-background-dark dark:bg-background-light"
                    onPress={handleStopDownload}>
                    <AnimatedCircularProgress
                      size={40}
                      width={5}
                      rotation={0}
                      fill={progressDownload}
                      tintColor="blue">
                      {fill => (
                        <CloseCircle
                          size={15}
                          color={colorScheme === 'dark' ? 'black' : 'white'}
                        />
                      )}
                    </AnimatedCircularProgress>
                  </TouchableOpacity>
                ) : isDownloaded ? (
                  <TouchableOpacity
                    className="items-center justify-center h-10  w-10 rounded-full bg-blue-600"
                    onPress={handleDeleteEpisode}>
                    <TickCircle size={15} color={'white'} />
                  </TouchableOpacity>
                ) : isFail ? (
                  <TouchableOpacity
                    className="items-center justify-center h-10  w-10 rounded-full  bg-background-dark dark:bg-background-light"
                    onPress={handleDownloadAudio}>
                    <RefreshCircle
                      size={15}
                      color={colorScheme === 'dark' ? 'black' : 'white'}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="items-center justify-center h-10  w-10 rounded-full  bg-background-dark dark:bg-background-light"
                    onPress={handleDownloadAudio}>
                    <Import
                      size={15}
                      color={colorScheme === 'dark' ? 'black' : 'white'}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  className="items-center justify-center h-14  w-14 rounded-full  bg-background-dark dark:bg-background-light"
                  onPress={handlePlayEpisode}>
                  <Play
                    size={15}
                    color={colorScheme === 'dark' ? 'black' : 'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center justify-center h-10  w-10 rounded-full  bg-background-dark dark:bg-background-light"
                  onPress={() => onShare()}>
                  <TransmitSqaure2
                    size={15}
                    color={colorScheme === 'dark' ? 'black' : 'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className="mb-10">
              <View className="flex flex-row items-center space-x-2 justify-start mb-1">
                <View className="h-7 p-0.5 bg-base-primary rounded-full" />
                <Text className="text-base font-semibold text-black dark:text-white">
                  Sumario
                </Text>
              </View>
              <View className=" w-full py-2 px-2 bg-white dark:bg-background-darkLight rounded-lg">
                <RenderHtml
                  baseStyle={htmlColor}
                  contentWidth={width}
                  source={{html: summary}}
                />
              </View>

              <View className="flex flex-row items-center space-x-2 justify-start mb-1">
                <View className="h-7 p-0.5 bg-base-primary rounded-full" />
                <Text className="text-base font-semibold text-black dark:text-white">
                  Descrição
                </Text>
              </View>
              <View className=" w-full py-2 px-2 bg-white dark:bg-background-darkLight rounded-lg">
                <RenderHtml
                  baseStyle={htmlColorDesc}
                  contentWidth={width}
                  source={{html: description.replace(/\n/g, '<br />')}}
                />
              </View>
            </View>
          </ScrollView>
        ) : (
          <View className="flex flex-col justify-between px-2 py-2">
            <View className="flex flex-col w-full h-72  items-center justify-center  bg-white dark:bg-background-darkLight rounded-lg px-2 py-2">
              <ActivityIndicator size="large" color={'#505059'} />
            </View>
            <View className="flex flex-col w-full h-20  items-center justify-center  bg-white dark:bg-background-darkLight rounded-lg px-2 py-2 mt-3">
              <ActivityIndicator size="large" color={'#505059'} />
            </View>
            <View className="flex flex-col w-full h-40  items-center justify-center  bg-white dark:bg-background-darkLight rounded-lg px-2 py-2  mt-3">
              <ActivityIndicator size="large" color={'#505059'} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
