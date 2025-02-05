import 'react-native-reanimated'
import {Stack} from 'expo-router'

export default function ProtectedLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="postDetails" options={{title: "Post"}}/>
        </Stack>
    )
}
