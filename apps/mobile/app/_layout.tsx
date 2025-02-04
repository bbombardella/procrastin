import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';

import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const client = new QueryClient()

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	})

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<QueryClientProvider client={client}>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: true, title:"Procrastin" }} />
					<Stack.Screen name="+not-found" />
					<Stack.Screen name="postDetails" options={{ title: "Post" }}/>
				</Stack>
				<StatusBar style="auto" />
			</QueryClientProvider>
		</ThemeProvider>
	)
}
