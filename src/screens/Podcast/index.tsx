import {View, RefreshControl, ScrollView, Text} from 'react-native';

import React, {useState, useEffect} from 'react';
import {Header} from '@/components/Header';
import PodcastSvg from '../../assets/undraw_audio-conversation_zg3f.svg';
import {LatestEpisodes, HighlightChannels} from './components';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {getPodcastRss} from '@/services/api/get-podcast-rss';
import axios from 'axios';

type Podcast = {
  navigation: BottomTabNavigationProp<RootTabParamList, 'Podcast'>;
};

export const Podcast: React.FC<Podcast> = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const [componentKey, setComponentKey] = useState(0);
  const [activesPodcasts, setActivesPodcasts] = useState(true);

  function refreshFunc() {
    setRefresh(true);
    setActivesPodcasts(true);
    setComponentKey(componentKey + 1);
    setRefresh(false);
  }

  useEffect(() => {
    const verifyPodcast = async () => {
      try {
        const getPod = await getPodcastRss(1, 10);
        return getPod;
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e.code === 'ERR_NETWORK') {
            setActivesPodcasts(true);
            return;
          }
        }
        setActivesPodcasts(false);
      }
    };
    verifyPodcast();
  }, [componentKey]);

  return (
    <View className="items-center justify-start min-h-screen bg-background-light dark:bg-background-dark ">
      <Header />
      <View className="flex-1 flex-col w-full  px-5 mt-5 space-y-3 mb-[190px]">
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={refreshFunc} />
          }
          className="flex flex-col h-full py-2 space-y-2">
          {activesPodcasts ? (
            <View>
              <View>
                <HighlightChannels
                  navigation={navigation}
                  key={`child1-${componentKey}`}
                />
              </View>
              <View>
                <LatestEpisodes
                  navigation={navigation}
                  key={`child2-${componentKey}`}
                />
              </View>
            </View>
          ) : (
            <>
              <View className="flex justify-center items-center py-2 px-2 w-full h-96">
                <Text className="text-lg text-justify text-gray-500 font-Poppins-Medium dark:text-gray-200 mb-5">
                  Nenhum Podcast Castrado
                </Text>
                <PodcastSvg width={320} height={120} />
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};
