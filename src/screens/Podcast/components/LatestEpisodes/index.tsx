import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useState, useEffect, useCallback} from 'react';
import {useColorScheme} from 'nativewind';
import {Timer1, TickCircle} from 'iconsax-react-native';
import RNFS from 'react-native-fs';
import {parser} from '@/services/XmlParse';
import {getPodcastRss} from '@/services/api/get-podcast-rss';
import {PodcastChannel} from '@/services/PodcastChannel';
import {PodcastEpisode} from '@/services/PodcastEpisode';
import RenderHtml from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import {stylesDarkBodySummary, stylesWhiteBodySummary} from '@/services/style';
import Toast from 'react-native-toast-message';
import md5 from 'crypto-js/md5';

interface LatestEpisodesProps {
  navigation: NavigationProp<RootTabParamList>;
}

export const LatestEpisodes: React.FC<LatestEpisodesProps> = ({navigation}) => {
  const [isFetching, setFetching] = useState(true);
  const {colorScheme} = useColorScheme();
  const [idList, setIdList] = useState<string[]>([]);
  const [length, setLength] = useState<number>(-1);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [baseColor, setBaseColor] = useState({});
  const [isFocus, setIsFocus] = useState<boolean>();
  const {width} = useWindowDimensions();

  function goToSheetEpisode(episode: PodcastEpisode) {
    navigation.navigate('SheetEpisode', {episode});
  }

  async function isDownload(id: string) {
    try {
      const localPath = `${RNFS.DocumentDirectoryPath}/episodeOffline${md5(
        id,
      ).toString()}.mp3`;
      const result = await RNFS.exists(localPath);
      if (result) {
        setIdList(oldId => [...oldId, id]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function handleIsFocus() {
    episodes.forEach(item => {
      if (!idList.includes(item.id)) {
        isDownload(item.id);
      }
    });
  }

  useFocusEffect(
    useCallback(() => {
      setIdList([]);
      handleIsFocus();
      return () => {
        setIdList([]);
        handleIsFocus();
        setIsFocus(!isFocus);
      };
    }, [isFocus]),
  );

  useEffect(() => {
    if (colorScheme === 'dark') {
      setBaseColor(stylesDarkBodySummary);
      return;
    }
    setBaseColor(stylesWhiteBodySummary);
  }, [colorScheme]);

  useEffect(() => {
    if (length === episodes.length) {
      if (length === 0) {
        Toast.show({
          type: 'info',
          text1: 'Nenhum episódio cadastrado',
        });
      }
      setFetching(false);
    }
    handleIsFocus();
  }, [length, episodes]);

  useEffect(() => {
    getPodcastRss(1, 10).then(item => {
      setLength(item.length);
      item.forEach(async element => {
        const fetchRss = await fetch(element.url);
        if (fetchRss.ok) {
          const stringXml = await fetchRss.text();
          const xmlJson = parser.parse(stringXml) as XmlPodcast;
          const auth = new PodcastChannel(xmlJson, element.id);
          if (auth.items != undefined) {
            const lastEpisode = auth.items[0];
            const episode = new PodcastEpisode(
              lastEpisode,
              auth.auth,
              auth.rssId,
            );

            setEpisodes(e => [...e, episode]);
          } else {
            setLength(prevLength => prevLength - 1);
          }
        } else {
          setLength(prevLength => prevLength - 1);
        }
      });
    });
  }, []);

  return (
    <View className="flex flex-col gap-0.5 mt-2">
      <View className="flex flex-row items-center justify-start">
        <View className="flex flex-row items-center space-x-2">
          <View className="h-7 p-0.5 bg-base-primary rounded-full" />
          <Text className="text-base font-semibold text-black dark:text-white">
            Últimos Episódios
          </Text>
        </View>
      </View>
      <View className="flex flex-col w-full gap-y-1.5 ">
        {isFetching
          ? Array.from({length: 3}, (_, index) => {
              return (
                <View
                  className="flex flex-row items-center w-full max-w-full p-3 space-x-2 bg-white rounded-md dark:bg-background-darkLight"
                  key={index}>
                  <View className="flex items-center justify-center w-full h-20">
                    <ActivityIndicator size="large" color={'#505059'} />
                  </View>
                </View>
              );
            })
          : episodes.map((episode: PodcastEpisode, index: number) => {
              return (
                <TouchableOpacity
                  className="flex flex-row items-center w-full max-w-full p-3 space-x-2 bg-white rounded-md dark:bg-background-darkLight"
                  onPress={() => goToSheetEpisode(episode)}
                  key={index}>
                  <View className="w-20 h-20">
                    <Image
                      className="w-full h-full rounded-md"
                      source={{
                        uri: episode.image,
                      }}
                    />
                  </View>
                  <View className="flex flex-col flex-1 gap-y-2">
                    <View>
                      <Text
                        numberOfLines={2}
                        className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                        {episode.title}
                      </Text>
                    </View>
                    <RenderHtml
                      contentWidth={width}
                      baseStyle={baseColor}
                      source={{html: episode.summary}}
                    />
                    <View className="flex flex-row justify-between">
                      <View className="flex flex-row justify-start items-center">
                        <Timer1
                          size="12"
                          color={colorScheme === 'dark' ? 'gray' : 'black'}
                        />
                        <Text
                          numberOfLines={1}
                          className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                          : {episode.duration}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                        {episode.auth}
                      </Text>
                    </View>

                    <TickCircle
                      size={12}
                      color={
                        idList.includes(episode.id)
                          ? 'blue'
                          : colorScheme === 'dark'
                          ? 'gray'
                          : 'black'
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
      </View>
    </View>
  );
};
