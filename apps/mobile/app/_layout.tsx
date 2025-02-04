import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { SupabaseProvider } from '../context/supabase-provider'
import { useColorScheme } from '../hooks/useColorScheme'

import 'react-native-reanimated'

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
				<SupabaseProvider>
					<Stack>
						<Stack.Screen name="(public)/sign-in" options={{ headerShown: false, title: 'Sign In' }} />
						<Stack.Screen name="(public)/sign-up" options={{ title: 'Sign Up' }} />
						<Stack.Screen name="(protected)" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="auto" />
				</SupabaseProvider>
			</QueryClientProvider>
		</ThemeProvider>
	)
}
