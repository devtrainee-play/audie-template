import React, {useEffect, useState} from 'react';
import {CommonActions, NavigationProp} from '@react-navigation/native';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {ArrowCircleLeft} from 'iconsax-react-native';
import {parser} from '@/services/XmlParse';
import {getEpisodePodcast} from '@/services/api/get-episodes';
import {PodcastChannel} from '@/services/PodcastChannel';
import {PodcastEpisode} from '@/services/PodcastEpisode';
import Toast from 'react-native-toast-message';
import {UseGlobalStates} from '@/hooks/context';

interface SharedEpisodeProps {
  route: any;
  navigation: NavigationProp<RootTabParamList>;
}

export const SharedEpisode: React.FC<SharedEpisodeProps> = ({
  navigation,
  route,
}) => {
  const {setShared} = UseGlobalStates();
  const {id, guid} = route.params;

  function goBack() {
    navigation.dispatch(CommonActions.navigate('MainPodcast'));
  }

  function guildId(element: string | Guid) {
    if (typeof element === 'string') {
      return decodeURIComponent(element);
    }
    return decodeURIComponent(element['#text']);
  }

  useEffect(() => {
    getEpisodePodcast(id)
      .then(async item => {
        const fetchRss = await fetch(item.url);
        const stringXml = await fetchRss.text();
        const jsonXml = parser.parse(stringXml) as XmlPodcast;
        const auth = new PodcastChannel(jsonXml, item.id);

        const finedEpisode = auth.items.find(element => {
          const index = guildId(element.guid) === guid.trim();
          return index;
        });

        if (finedEpisode === undefined) {
          navigation.dispatch(CommonActions.navigate('MainPodcast'));

          Toast.show({
            type: 'warning',
            text1: 'Falha ao acessar episódio',
            text2: 'Episódio não encontrado',
          });

          return;
        }

        const episode = new PodcastEpisode(
          finedEpisode!,
          auth.auth,
          auth.rssId,
        );

        setShared(true);
        navigation.navigate('SheetEpisode', {episode});
      })
      .catch(() => {
        navigation.dispatch(CommonActions.navigate('MainPodcast'));

        Toast.show({
          type: 'warning',
          text1: 'Falha ao acessar o Podcast',
          text2: 'Podcast inativo',
        });
      });
  }, [route]);

  useEffect(() => {
    const goBack = () => {
      setShared(false);
      navigation.navigate('MainPodcast');
      return true;
    };

    const handleBack = BackHandler.addEventListener(
      'hardwareBackPress',
      goBack,
    );

    return () => handleBack.remove();
  });
  return (
    <View className=" items-center justify-start min-h-screen bg-background-light dark:bg-background-dark ">
      <View className="flex flex-col w-full  justify-start">
        <View className="px-2 py-4 w-full">
          <TouchableOpacity onPress={goBack}>
            <ArrowCircleLeft className=" text-base-primary" />
          </TouchableOpacity>
        </View>
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
      </View>
    </View>
  );
};
