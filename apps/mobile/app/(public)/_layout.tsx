import {SafeAreaView} from 'react-native-safe-area-context';
import {Stack} from 'expo-router';

export default function PublicLayout() {
    return (
        <SafeAreaView className="flex-1">
            <Stack>
                <Stack.Screen name="sign-in" options={{headerShown: false, title: 'Sign In'}}/>
                <Stack.Screen name="sign-up" options={{title: 'Sign Up'}}/>
            </Stack>
        </SafeAreaView>
    );
}
