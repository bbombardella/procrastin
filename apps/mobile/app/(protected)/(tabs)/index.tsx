import { FlatList } from 'react-native';
import Post from '../../../components/Post';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '../../../components/ui/avatar';
import { Text } from '../../../components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';

const posts = [
    {
        id: '1',
        profileName: 'John Doe',
        imageUrl: 'https://picsum.photos/id/237/320/208',
        description: 'Premier post sur notre réseau social !',
    },
    {
        id: '2',
        profileName: 'Machin Chouette',
        imageUrl: 'https://picsum.photos/id/259/300/208',
        description: 'Un autre post avec une belle image.',
    },
];

export default function HomeScreen() {
    return (
        <SafeAreaView className='bg-tertiary-0 flex-1'>
            <HStack className="w-full p-4" space="xl" alignItems="center">
                <Avatar size="lg">
                    <AvatarFallbackText>Mon User</AvatarFallbackText>
                    <AvatarImage
                        source={{
                            uri: `https://picsum.photos/${201}`,
                        }}
                    />
                    <AvatarBadge/>
                </Avatar>
                <Text size="lg" bold>
                    Mon User
                </Text>
            </HStack>
            
            <VStack className="px-4 flex-1" >
                <FlatList
                className='flex-1'
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
                    
                />
            </VStack>
        </SafeAreaView>
    );
}