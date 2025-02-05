import { FlatList, StyleSheet, useColorScheme } from 'react-native';
import Post from '../../../components/Post';
import {SafeAreaView} from 'react-native-safe-area-context';

const posts = [
    {
        id: '1',
        profileName: 'John Doe',
        imageUrl: 'https://picsum.photos/id/237/200/300',
        description: 'Premier post sur notre réseau social !',
    },
    {
        id: '2',
        profileName: 'Machin Chouette',
        imageUrl: 'https://picsum.photos/id/259/200/300',
        description: 'Un autre post avec une belle image.',
    },
];

export default function HomeScreen() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <SafeAreaView style={[
            styles.container, 
            isDarkMode && styles.containerDark
        ]}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Post
                        id={item.id}
                        profileName={item.profileName}
                        imageUrl={item.imageUrl}
                        description={item.description}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    isDarkMode && styles.listContentDark
                ]}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    listContent: {
        gap: 16,
        paddingBottom: 16,
    },
    listContentDark: {
        backgroundColor: '#121212',
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
});
