import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {getPodcastRss} from '@/services/api/get-podcast-rss';
import {PodcastChannel} from '@/services/PodcastChannel';
import {parser} from '@/services/XmlParse';
import Toast from 'react-native-toast-message';

interface HighlightChannelsProps {
  navigation: NavigationProp<RootTabParamList>;
}

export const HighlightChannels: React.FC<HighlightChannelsProps> = ({
  navigation,
}) => {
  const [isLoaded, setLoaded] = useState(true);
  const [channels, setChannels] = useState<PodcastChannel[]>([]);
  const [shuffled, setShuffled] = useState<PodcastChannel[]>([]);
  const [length, setLength] = useState(-1);

  function shuffleArray() {
    const shuffle = channels;
    for (let i = channels.length - 1; i > 0; i--) {
      const j: any = Math.floor(Math.random() * (i + 1));
      [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
    }
    setShuffled(shuffle);
  }

  function goToChannels() {
    navigation.navigate('Channels');
  }

  function goToEpisodes(auth: Auth) {
    navigation.navigate('Episodes', {auth});
  }

  useEffect(() => {
    getPodcastRss(1, 10).then(async item => {
      setLength(item.length);

      item.forEach(async element => {
        const fetchRss = await fetch(element.url);
        if (fetchRss.ok) {
          const stringXml = await fetchRss.text();
          const XmlJson = parser.parse(stringXml) as XmlPodcast;
          const auth = new PodcastChannel(XmlJson, element.id);

          setChannels(el => [...el, auth]);
        } else {
          Toast.show({
            type: 'warning',
            text1: 'Falha ao carregar podcasts!',
            text2: 'Não foi possível acessar um ou mais links de podcast!',
          });
          setLength(prevLength => prevLength - 1);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (channels.length === length) {
      shuffleArray();
      setLoaded(false);
    }
  }, [channels, length]);

  return (
    <View className="flex flex-col gap-y-3">
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-x-2">
          <View className="h-7 p-0.5 bg-base-primary rounded-full" />
          <Text className="text-base text-black font-Poppins-Medium dark:text-white">
            Canais em destaque
          </Text>
        </View>
        <TouchableOpacity onPress={goToChannels}>
          <Text className="text-xs font-Poppins-Regular text-base-primary">
            Veja mais canais
          </Text>
        </TouchableOpacity>
      </View>
      {isLoaded ? (
        <View className="flex items-center justify-center px-2 py-3 bg-white rounded-lg dark:bg-background-darkLight h-44 w-[90vw]">
          <ActivityIndicator size="large" color={'#505059'} />
        </View>
      ) : (
        <Swiper
          className="flex max-h-44"
          showsButtons={false}
          showsPagination={false}
          autoplay
          autoplayTimeout={5}
          showsHorizontalScrollIndicator={false}>
          {shuffled.map((channel: PodcastChannel, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => goToEpisodes(channel)}>
                <Image
                  className="h-full rounded-md"
                  source={{
                    uri: channel.image,
                  }}></Image>
              </TouchableOpacity>
            );
          })}
        </Swiper>
      )}
    </View>
  );
};
