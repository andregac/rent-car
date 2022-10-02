import { LogBox } from 'react-native'


import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from 'styled-components';

import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold
} from '@expo-google-fonts/archivo';
import {
  Inter_400Regular,
  Inter_500Medium
} from '@expo-google-fonts/inter';


import * as Font from 'expo-font';

import {Routes} from './src/routes'
import theme from './src/global/styles/theme';
import {AppProvider} from './src/hooks/'


export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          Archivo_400Regular,
          Archivo_500Medium,
          Archivo_600SemiBold,
          Inter_400Regular,
          Inter_500Medium
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return(
    <View
      onLayout={onLayoutRootView}
      style={{
       flex: 1}}> 
        <ThemeProvider theme={theme}>
          <AppProvider>
            <Routes/>
          </AppProvider>
        </ThemeProvider>
    </View>
  );
}