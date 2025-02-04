import ParallaxScrollView from '@/components/ParallaxScrollView';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import Post from '@/components/Post';

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
	return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }
        >
            <View style={styles.container}>
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Post
						profileName={item.profileName}
                            imageUrl={item.imageUrl}
                            description={item.description}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
    container: {
        padding: 16,
    },
    reactLogo: {
		height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
