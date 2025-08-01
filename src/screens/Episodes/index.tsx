import {NavigationProp, useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useColorScheme} from 'nativewind';
import {Header} from '@/components/Header';
import {
  ArrowCircleLeft,
  SearchNormal1,
  VideoSquare,
  UserSquare,
  Timer1,
  TickCircle,
} from 'iconsax-react-native';
import RNFS from 'react-native-fs';
import {stylesDarkBodySummary, stylesWhiteBodySummary} from '@/services/style';
import RenderHtml from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import {PodcastEpisode} from '@/services/PodcastEpisode';
import Toast from 'react-native-toast-message';
import {UseGlobalStates} from '@/hooks/context';
import md5 from 'crypto-js/md5';

type EpisodesProps = {
  route: any;
  navigation: NavigationProp<RootTabParamList>;
};

export const Episodes: React.FC<EpisodesProps> = ({navigation, route}) => {
  const {colorScheme} = useColorScheme();
  const [input, setInput] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [isLoaded, setLoaded] = useState(true);
  const [idList, setIdList] = useState<string[]>([]);
  const [data, setData] = useState<Episode[]>([]);
  const [filter, setFilter] = useState<Episode[]>([]);
  const {width} = useWindowDimensions();
  const [htmlColor, setHtmlColor] = useState({});
  const {title, image, auth, episodes, description, rssId, items} =
    route.params.auth;
  const {setShared} = UseGlobalStates();
  function goToChannels() {
    navigation.goBack();
  }

  function goToSheetEpisode(episode: Episode) {
    setShared(false);
    navigation.navigate('SheetEpisode', {episode});
  }

  function handleSearchEpisode(value: string) {
    const result = data?.filter(item => {
      const titleMach = item.title.toLowerCase().includes(value.toLowerCase());
      return titleMach;
    });
    setFilter(result);
    setInput(value);
  }

  function handlePaginationScrolling() {
    episodePagination();
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
    filter.forEach(item => {
      if (!idList.includes(item.id)) {
        isDownload(item.id);
      }
    });
  }

  function episodePagination() {
    items
      .slice(data.length, data.length + 10)
      .forEach((element: ItemPodcast) => {
        const episode = new PodcastEpisode(element, auth, rssId);

        setFilter(el => [...el, episode]);
        setData(el => [...el, episode]);
      });
  }

  function handleEpisode() {
    if (items != undefined) {
      episodePagination();
      setLoaded(false);
      return;
    }

    Toast.show({
      type: 'info',
      text1: 'Nenhum episódio cadastrado',
    });
    setLoaded(false);
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
      setHtmlColor(stylesDarkBodySummary);
      return;
    }

    setHtmlColor(stylesWhiteBodySummary);
  }, [colorScheme]);

  useEffect(() => {
    handleIsFocus();
  }, [filter]);

  useEffect(() => {
    handleEpisode();
  }, []);

  return (
    <View className="items-center justify-start min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <View className="flex flex-col w-full mt-2 ">
        <View className="flex flex-row w-full items-center justify-evenly">
          <TouchableOpacity onPress={goToChannels}>
            <ArrowCircleLeft className="text-xs font-Poppins-Regular text-base-primary" />
          </TouchableOpacity>
          <View className="flex flex-row items-center w-80 space-x-2 border-0.5 dark:border-white rounded-lg px-2">
            <View>
              <SearchNormal1
                size={22}
                color={colorScheme === 'dark' ? 'white' : 'black'}
                variant="Outline"
              />
            </View>
            <View>
              <TextInput
                className="h-12 text-xs text-black dark:text-white"
                onChangeText={handleSearchEpisode}
                value={input}
                placeholderTextColor={
                  colorScheme === 'dark' ? 'white' : 'black'
                }
                placeholder="Pesquise pelo canal ou pelo episodio aqui"
              />
            </View>
          </View>
        </View>
      </View>
      <View className="flex flex-col  w-full  px-2 ">
        {isLoaded ? (
          <>
            <View className="flex flex-row items-center w-full max-w-full p-3 space-x-2 bg-white rounded-md dark:bg-background-darkLight mt-2">
              <View className="flex items-center justify-center w-full h-20">
                <ActivityIndicator size="large" color={'#505059'} />
              </View>
            </View>
            <View className="flex flex-row items-center w-full max-w-full p-3 space-x-2 bg-white rounded-md dark:bg-background-darkLight mt-2">
              <View className="flex items-center justify-center w-full h-20">
                <ActivityIndicator size="large" color={'#505059'} />
              </View>
            </View>
            <View className="flex flex-row items-center w-full max-w-full p-3 space-x-2 bg-white rounded-md dark:bg-background-darkLight mt-2">
              <View className="flex items-center justify-center w-full h-20">
                <ActivityIndicator size="large" color={'#505059'} />
              </View>
            </View>
          </>
        ) : (
          <></>
        )}
        {
          <FlatList
            data={filter}
            className="mb-[450px]"
          showsVerticalScrollIndicator={false}
            onEndReached={handlePaginationScrolling}
            onEndReachedThreshold={0.5}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  className="flex flex-row items-center w-full max-w-full mt-2 p-3 space-x-2 bg-white rounded-md dark:bg-background-darkLight"
                  onPress={() => goToSheetEpisode(item)}>
                  <View className="w-20 h-20">
                    <Image
                      className="w-full h-full rounded-md"
                      source={{
                        uri: item.image,
                      }}
                    />
                  </View>
                  <View className="flex flex-col flex-1 gap-y-2">
                    <View>
                      <Text
                        numberOfLines={2}
                        className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                        {item.title}
                      </Text>
                    </View>
                    <RenderHtml
                      contentWidth={width}
                      baseStyle={htmlColor}
                      source={{html: item.summary}}
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
                          : {item.duration}
                        </Text>
                      </View>
                      <Text
                        numberOfLines={1}
                        className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                        {item.auth}
                      </Text>
                    </View>

                    <TickCircle
                      size={12}
                      color={
                        idList.includes(item.id)
                          ? 'blue'
                          : colorScheme === 'dark'
                          ? 'gray'
                          : 'black'
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        }
      </View>
    </View>
  );
};
