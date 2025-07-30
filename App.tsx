/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StatusBar} from 'react-native';
import Navigation from './src/navigation';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Toast, {ErrorToast, BaseToast} from 'react-native-toast-message';
import {ContextProvider} from '@/hooks/context';
import 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NoConnection} from '@/components/NoConnection';

function App(): React.JSX.Element {
  const queryClient = new QueryClient();
  const toastConfig = {
    error: (props: any) => (
      <ErrorToast
        {...props}
        text2Style={{color: 'grey'}}
        style={{borderLeftColor: '#FF3333'}}
      />
    ),
    warning: (props: any) => (
      <BaseToast
        {...props}
        text2Style={{color: 'grey'}}
        style={{borderLeftColor: '#EED202'}}
      />
    ),
  };

  const liking = {
    prefixes: [
      'https://planner.stationoffice.com.br',
      'http://planner.stationoffice.com.br',
    ],
    config: {
      screens: {
        MainScreen: {
          path: 'app',
          screens: {
            Podcast: {
              path: 'podcast',
              screens: {
                SharedEpisode: 'episode/:id',
              },
            },
          },
        },
      },
    },
  };

  return (
    <ContextProvider>
      <SafeAreaView style={{flex: 1}}>
        <NoConnection />
        <StatusBar barStyle={'light-content'} backgroundColor={'#000'} />
        <NavigationContainer linking={liking}>
          <QueryClientProvider client={queryClient}>
            <Navigation />
          </QueryClientProvider>
        </NavigationContainer>
        <Toast config={toastConfig} />
      </SafeAreaView>
    </ContextProvider>
  );
}

export default App;
