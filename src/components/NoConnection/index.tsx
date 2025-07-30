import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

export const NoConnection = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isBack, setIsBack] = useState(false);

  useEffect(() => {
    NetInfo.addEventListener(state => {
      if (state.isConnected === true) {
        setIsOnline(true);
        setIsBack(false);
        return;
      }
      if (state.isConnected === false) {
        setIsOnline(false);
        setIsBack(true);
        return;
      }
      console.log(isOnline);
      setIsOnline(true);
    });
  });

  useEffect(() => {
    if (isBack === true && isOnline == true) {
      Toast.show({
        type: 'success',
        text1: 'Você está online novamente',
      });
    }
  }, [isBack, isOnline]);
  return (
    <>
      {!isOnline && (
        <View className="w-full flex items-center justify-center bg-gray-400 ">
          <Text className="flex items-center justify-center font-Poppins-Regular">
            Você está offline
          </Text>
        </View>
      )}
    </>
  );
};
