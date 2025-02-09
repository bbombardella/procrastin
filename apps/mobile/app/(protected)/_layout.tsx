import 'react-native-reanimated'
import {Stack} from 'expo-router'

export default function ProtectedLayout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="postDetails/[id]" options={{ title: "Post", presentation: "modal" }} />
            <Stack.Screen name="passwordEdition" options={{title: "Edit my password", headerBackTitle: "My profile"}}/>
        </Stack>
    )
}
