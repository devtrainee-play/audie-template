import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {SearchNormal1} from 'iconsax-react-native';
import {useColorScheme} from 'nativewind';
import {useEffect, useState} from 'react';
import {Header} from '../../components/Header';
import {getPromotions} from '../../services/api/get-promotions';
import {isBefore, isEqual} from 'date-fns';
import {PromotionsSkeleton} from './components';
import {RefreshControl} from 'react-native';

interface PromorionScreenProps {
  navigation: BottomTabNavigationProp<RootTabParamList>;
}

export const Promotions: React.FC<PromorionScreenProps> = ({navigation}) => {
  const [input, setInput] = useState<string>('');
  const [data, setData] = useState<Promotiom[]>([]);
  const [filterData, setFilterData] = useState<Promotiom[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState(false);

  function refreshing() {
    setRefresh(true);
    setData([]);
    setFilterData([]);
    setIsLoading(true);
    getPromotions('1', undefined)
      .then(response => {
        const promotions = response.filter(item => {
          const endDate = new Date(item.endDate);
          const today = new Date();
          const promotionFinished =
            isBefore(endDate, today) || isEqual(endDate, today);
          if (item.isAd != true && promotionFinished == false) {
            return item;
          }
        });
        setData(promotions);
        setFilterData(promotions);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
    setRefresh(false);
  }

  useEffect(() => {
    getPromotions('1', undefined)
      .then(response => {
        const promotions = response.filter(item => {
          const endDate = new Date(item.endDate);
          const today = new Date();
          const promotionFinished =
            isBefore(endDate, today) || isEqual(endDate, today);
          if (item.isAd != true && promotionFinished == false) {
            return item;
          }
        });
        setData(promotions);
        setFilterData(promotions);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const {colorScheme} = useColorScheme();

  function goToSheetPromotion(promotiom: Promotiom) {
    navigation.navigate('SheetPromotion', {
      promotiom,
    });
  }

  function handleFilterInputData(value: string) {
    const filteredResult = data.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(value.toLowerCase());
      return titleMatch;
    });
    const promotions = filteredResult.filter(item => {
      const endDate = new Date(item.endDate);
      const today = new Date();
      const promotionFinished =
        isBefore(endDate, today) || isEqual(endDate, today);
      if (item.isAd != true && promotionFinished == false) {
        return item;
      }
    });
    setFilterData(promotions);
    setInput(value);
  }

  function handlePaginationScrolling() {
    const lastId = data[data.length - 1].id.toString();
    getPromotions('1', lastId)
      .then(response => {
        if (!response) {
          return;
        }
        const promotions = response.filter(item => {
          const endDate = new Date(item.endDate);
          const today = new Date();
          const promotionFinished =
            isBefore(endDate, today) || isEqual(endDate, today);
          if (item.isAd != true && promotionFinished == false) {
            return item;
          }
        });
        const newsPromotions = [...data, ...promotions];
        setData(newsPromotions);
        setFilterData(newsPromotions);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View className="items-center justify-start min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <View className="flex flex-col w-full px-5 mt-3 space-y-3">
        <View className="flex flex-row items-center justify-between w-full border-0.5 dark:border-white rounded-lg px-2">
          <View className="flex flex-row items-center gap-x-2">
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
              placeholder="Pesquise pelo título da promoção ou pelo nível"
            />
          </View>
        </View>
        <View className="flex flex-col mb-[550px]">
          {isLoading ? (
            <PromotionsSkeleton />
          ) : (
            <FlatList
              data={filterData}
              showsVerticalScrollIndicator={false}
              onEndReached={handlePaginationScrolling}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={refreshing} />
              }
              keyExtractor={filterData => filterData.id.toString()}
              renderItem={({item: promotiom}) => {
                return (
                  <TouchableOpacity
                    className="my-2"
                    onPress={() => goToSheetPromotion(promotiom)}
                    key={promotiom.id}>
                    <Image
                      className="h-32 rounded-t-md"
                      source={{uri: promotiom.imageUrl}}
                    />
                    <View className="relative flex flex-col px-2 py-3 space-y-2 bg-white rounded-b-lg dark:bg-background-darkLight">
                      <Text className="text-sm font-Poppins-Medium text-neutral-700 dark:text-gray-200">
                        {promotiom.title}
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
