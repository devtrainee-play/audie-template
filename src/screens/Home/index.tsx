import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RefreshControl, ScrollView, View} from 'react-native';
import {Header} from '../../components/Header';
import {Advertising, AllNews, TopPromotions} from './components';
import {useColorScheme} from 'nativewind';
import {useEffect, useState} from 'react';
import storage from '../../services/storage';

interface HomeScreenProps {
  navigation: BottomTabNavigationProp<RootTabParamList>;
}

export const Home: React.FC<HomeScreenProps> = ({navigation}) => {
  const {setColorScheme} = useColorScheme();
  const [refresh, setRefresh] = useState(false);
  const [componentKey, setComponentKey] = useState(0);

  function refreshing() {
    setRefresh(true);
    setComponentKey(key => key + 1);
    setRefresh(false);
  }

  useEffect(() => {
    const theme = storage.getDarkMode();
    setColorScheme(theme ? theme : 'system');
  }, []);

  return (
    <View className="items-center justify-start min-h-screen bg-background-light dark:bg-background-dark  ">
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshing} />
        }
        showsVerticalScrollIndicator={false}
        className="flex flex-col px-5 py-2 space-y-2 mb-[70px]">
        <View>
          <TopPromotions
            navigation={navigation}
            key={`child1-${componentKey}`}
          />
        </View>
        <View>
          <Advertising key={`child2-${componentKey}`} />
        </View>
        <View>
          <AllNews navigation={navigation} key={`child3-${componentKey}`} />
        </View>
      </ScrollView>
    </View>
  );
};
