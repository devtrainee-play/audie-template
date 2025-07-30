import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {SearchNormal1} from 'iconsax-react-native';
import {useColorScheme} from 'nativewind';
import {useEffect, useState} from 'react';
import {Header} from '../../components/Header';
import {getNews, News as INews} from '../../services/api/get-news';

type NewsScreenProps = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'News'>;
};

export const News: React.FC<NewsScreenProps> = ({navigation}) => {
  const {colorScheme} = useColorScheme();
  const [input, setInput] = useState<string>('');
  const [filterData, setFilterData] = useState<INews[]>([]);
  const [data, setData] = useState<INews[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);

  function refreshing() {
    setRefresh(true);
    setIsFetching(true);
    setData([]);
    setFilterData([]);
    getNews('1', 10)
      .then(response => {
        setData(response.result);
        setFilterData(response.result);
        setIsFetching(false);
      })
      .catch(error => {
        console.log(error);
        setIsFetching(false);
      });
    setRefresh(false);
  }

  useEffect(() => {
    getNews('1', 10)
      .then(response => {
        setData(response.result);
        setFilterData(response.result);
        setIsFetching(false);
      })
      .catch(error => {
        console.log(error);
        setIsFetching(true);
      });
  }, []);

  function goToSheetNews(news: any) {
    if (news.pubUri == null) {
      return navigation.navigate('SheetNews', {news});
    }
    Linking.openURL(news.pubUri);
  }

  function filterNewsByCategory(categoryId: number, categoryName: string) {
    if (categoryId == -1) {
      return setFilterData(data);
    }
    const filterByCategoryId = data.filter(
      item => item.category === categoryName,
    );
    setFilterData(filterByCategoryId);
  }

  function handleFilterInputData(value: string) {
    const filteredResult = data?.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(value.toLowerCase());
      const categoryMatch = item.category
        .toLowerCase()
        .includes(value.toLowerCase());
      return titleMatch || categoryMatch;
    });
    setFilterData(filteredResult);
    setInput(value);
  }

  function handlePaginationScrolling() {
    getNews('1', data.length + 10)
      .then(response => {
        const news = response.result;
        setData(news);
        setFilterData(news);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View className="items-center justify-start min-h-screen bg-background-light dark:bg-background-dark">
      <Header onFilterNewsByCategory={filterNewsByCategory} />
      <View className="flex flex-col w-full px-5 mt-3 space-y-3">
        <View className="flex flex-row items-center w-full space-x-2 border-0.5 dark:border-white rounded-lg px-2">
          <View>
            <SearchNormal1
              size={22}
              color={colorScheme === 'dark' ? 'white' : 'black'}
              variant="Outline"
            />
          </View>
          <TextInput
            className="h-12 text-xs text-black dark:text-white"
            onChangeText={handleFilterInputData}
            value={input}
            placeholderTextColor={colorScheme === 'dark' ? 'white' : 'black'}
            placeholder="Pesquise pelo título da nóticias ou pela categoria"
          />
        </View>
        <View className="flex flex-col mb-[605px]">
          {isFetching ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={refreshing} />
              }
              className="flex flex-col  py-2 space-y-2">
              {Array.from({length: 3}, (_, index) => {
                return (
                  <View
                    className="flex flex-row items-center w-full max-w-full p-3 my-1.5 space-x-2 bg-white rounded-md dark:bg-background-darkLight"
                    key={index}>
                    <View className="flex items-center justify-center w-full h-24">
                      <ActivityIndicator size="large" color="#FFF" />
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filterData}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={refreshing} />
              }
              onEndReached={handlePaginationScrolling}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item: news}) => {
                return (
                  <TouchableOpacity
                    className="my-2"
                    onPress={() => goToSheetNews(news)}
                    key={Math.random()}>
                    <Image
                      className="h-32 rounded-t-md"
                      source={{uri: news.imageUri}}
                    />
                    <View className="relative flex flex-col px-2 py-3 space-y-2 bg-white rounded-b-lg dark:bg-background-darkLight">
                      {news.category != '' && (
                        <View className="absolute py-0.5 px-4 rounded-md -top-4 left-2 flex bg-white">
                          <Text className="font-medium text-black">
                            {news.category}
                          </Text>
                        </View>
                      )}
                      <Text
                        numberOfLines={2}
                        className="text-xs font-Poppins-Medium text-neutral-700 dark:text-neutral-200">
                        {news.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};
