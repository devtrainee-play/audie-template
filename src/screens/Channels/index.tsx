import {NavigationProp} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import {
  ArrowCircleLeft,
  SearchNormal1,
  VideoSquare,
  UserSquare,
} from 'iconsax-react-native';
import {Header} from '@/components/Header';
import {useColorScheme} from 'nativewind';
import {parser} from '@/services/XmlParse';
import {getPodcastRss} from '@/services/api/get-podcast-rss';
import {PodcastChannel} from '@/services/PodcastChannel';

type ChannelsProps = {
  navigation: NavigationProp<RootTabParamList>;
};

export const Channels: React.FC<ChannelsProps> = ({navigation}) => {
  const {colorScheme} = useColorScheme();
  const [input, setInput] = useState('');
  const [lengthUrl, setLengthUrl] = useState(-1);
  const [refresh, setRefresh] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [data, setData] = useState<Auth[]>([]);
  const [filter, setFilter] = useState<Auth[]>([]);
  const [page, setPage] = useState<number>(2);

  async function handleSearchChannel(value: string) {
    const result = data?.filter(item => {
      const titleMach = item.title.toLowerCase().includes(value.toLowerCase());
      const authMach = item.auth.toLowerCase().includes(value.toLowerCase());
      return titleMach || authMach;
    });
    setFilter(result);
    setInput(value);
  }

  function refreshFunc() {
    setRefresh(true);
    setLoaded(true);
    setFilter([]);
    setData([]);
    setPage(2);
    setLengthUrl(-1);

    getPodcasts();

    setRefresh(false);
  }

  function getPodcasts() {
    getPodcastRss(1, 10).then(item => {
      setLengthUrl(item.length);
      item.forEach(async element => {
        const fetchRss = await fetch(element.url);

        if (fetchRss.ok) {
          const stringXml = await fetchRss.text();
          const XmlJson = parser.parse(stringXml) as XmlPodcast;
          const auth = new PodcastChannel(XmlJson, element.id);

          setFilter(el => [...el, auth]);
          setData(el => [...el, auth]);
        } else {
          setLengthUrl(prevLengthUrl => prevLengthUrl - 1);
        }
      });
    });
  }

  function goToPodcast() {
    navigation.goBack();
  }

  function goToEpisodes(auth: Auth) {
    navigation.navigate('Episodes', {auth});
  }

  function handlePaginationScrolling() {
    getPodcastRss(page, 10).then(async item => {
      item.forEach(async element => {
        const fetchRss = await fetch(element.url);
        if (fetchRss.ok) {
          const stringXml = await fetchRss.text();
          const XmlJson = parser.parse(stringXml) as XmlPodcast;
          const auth = new PodcastChannel(XmlJson, element.id);

          setFilter(el => [...el, auth]);
          setData(el => [...el, auth]);
        }
      });
    });
    setPage(prevPage => prevPage + 1);
  }

  useEffect(() => {
    if (
      data.length == lengthUrl ||
      data.length === 4 ||
      data.length === undefined
    ) {
      setLoaded(false);
    }
  }, [data, lengthUrl]);

  useEffect(() => {
    getPodcasts();
  }, []);

  return (
    <View className=" items-center justify-start min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <View className="flex flex-col w-full px-2 py-2">
        <View className="flex flex-row w-full items-center justify-evenly">
          <TouchableOpacity onPress={goToPodcast} className="  py-2 px-2">
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
                onChangeText={handleSearchChannel}
                value={input}
                placeholderTextColor={
                  colorScheme === 'dark' ? 'white' : 'black'
                }
                placeholder="Pesquise pelo nome canal ou pelo nome do autor"
              />
            </View>
          </View>
        </View>
      </View>
      <View className="flex flex-col w-full  mb-[310px] mt-3">
        <View className="flex flex-row items-center space-x-2 justify-start mb-1">
          <View className="h-7 p-0.5 bg-base-primary rounded-full" />
          <Text className="text-base font-semibold text-black dark:text-white">
            Canais de Podcast
          </Text>
        </View>

        {loaded ? (
          Array.from({length: 4}, (_, index) => {
            return (
              <View
                className="flex flex-row items-center w-full max-w-full p-3 space-x-2 bg-white rounded-md dark:bg-background-darkLight mt-2"
                key={index}>
                <View className="flex items-center justify-center w-full h-20">
                  <ActivityIndicator size="large" color={'#505059'} />
                </View>
              </View>
            );
          })
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filter}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={refreshFunc} />
            }
            className="mb-[330px]"
            onEndReached={handlePaginationScrolling}
            onEndReachedThreshold={0.5}
            keyExtractor={item => item.rssId.toString()}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  className="flex flex-row items-center w-full max-w-full p-3 space-x-2 bg-white rounded-md dark:bg-background-darkLight mt-2"
                  onPress={() => goToEpisodes(item)}>
                  <View className="w-20 h-20">
                    <Image
                      className="w-full h-full rounded-3xl"
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
                    <Text
                      numberOfLines={2}
                      className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                      {item.description}
                    </Text>
                    <View className="flex flex-row justify-between">
                      <View className="flex flex-row justify-start items-center">
                        <VideoSquare
                          size="12"
                          color={colorScheme === 'dark' ? 'gray' : 'black'}
                        />
                        <Text
                          numberOfLines={1}
                          className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                          : {item.episodes}
                        </Text>
                      </View>
                      <View className="flex flex-row justify-start items-center">
                        <UserSquare
                          size="12"
                          color={colorScheme === 'dark' ? 'gray' : 'black'}
                        />
                        <Text
                          numberOfLines={1}
                          className="text-xs text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200">
                          : {item.auth}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};
