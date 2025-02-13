import 'react-native-reanimated'

import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {useFonts} from 'expo-font'
import {Stack} from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import {StatusBar} from 'expo-status-bar'
import {useEffect} from 'react'

import {GluestackUIProvider} from '../components/ui/gluestack-ui-provider';
import {SupabaseProvider, useSupabase} from '../contexts/supabase-provider'
import {useColorScheme} from '../hooks/useColorScheme'

import "../global.css"
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { environment } from '@procrastin/environment'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const client = new QueryClient()

export default function RootLayout() {

    console.log(environment)
    
    const colorScheme = useColorScheme()
    const {initialized} = useSupabase()
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    })

    useEffect(() => {
        if (loaded && initialized) {
            SplashScreen.hideAsync()
        }
    }, [loaded, initialized])

    if (!loaded) {
        return null
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <GluestackUIProvider colorScheme={colorScheme}>
                <QueryClientProvider client={client}>
                    <SupabaseProvider>
                        <SafeAreaProvider>
                            <Stack>
                                <Stack.Screen name="(public)" options={{headerShown: false}}/>
                                <Stack.Screen name="(protected)" options={{headerShown: false}}/>
                                <Stack.Screen name="+not-found"/>
                            </Stack>
                            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
                        </SafeAreaProvider>
                    </SupabaseProvider>
                </QueryClientProvider>
            </GluestackUIProvider>
        </ThemeProvider>
    )
}
