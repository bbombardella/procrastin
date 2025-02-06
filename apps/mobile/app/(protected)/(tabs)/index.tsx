import { FlatList } from 'react-native';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '../../../components/ui/avatar';
import { Text } from '../../../components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostView from '../../../components/PostView';
import { Post } from '@prisma/client';

const posts: Post[] = [
    {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Premier post",
        content: "Premier post sur notre réseau social !",
        mediaUrl: "https://picsum.photos/id/237/320/208",
        published: true,
        authorId: 101,
    },
    {
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: "Un autre post",
        content: "Un autre post avec une belle image.",
        mediaUrl: "https://picsum.photos/id/259/300/208",
        published: true,
        authorId: 102,
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
                        <PostView
                            post={item}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    
                />
            </VStack>
        </SafeAreaView>
    );
}