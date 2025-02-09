import {FlatList} from 'react-native';
import {VStack} from '../../../components/ui/vstack';
import {HStack} from '../../../components/ui/hstack';
import {Avatar, AvatarBadge, AvatarFallbackText, AvatarImage} from '../../../components/ui/avatar';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostView from '../../../components/PostView';
import {Post} from '@prisma/client';
import {useBottomTabOverflow} from '../../../components/ui/TabBarBackground';
import {queryClient} from '../../../libs/http';
import {useSupabase} from '../../../context/supabase-provider';
import {Spinner} from '../../../components/ui/spinner';
import {Heading} from '../../../components/ui/heading';
import {useState} from 'react';

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
    const bottom = useBottomTabOverflow()
    const {user} = useSupabase()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const me = queryClient.users.me.useQuery([user?.email])
    const posts = queryClient.posts.getPosts.useQuery([])

    const refetch = async () => {
        setIsRefreshing(true)
        await posts.refetch()
        setIsRefreshing(false)
    }

    return (
        <SafeAreaView className='bg-tertiary-0 flex-1'>
            <VStack style={{paddingBottom: bottom, flex: 1}}>
                <HStack className="w-full p-4 items-center" space="xl">
                    {me.isLoading ?
                        <Spinner/>
                        :
                        <>
                            <Avatar size="lg">
                                <AvatarFallbackText>{me.data!!.body.firstName}&nbsp;{me.data!!.body.lastName}</AvatarFallbackText>
                                <AvatarImage
                                    source={{
                                        uri: me.data?.body?.profilePictureUrl,
                                    }}
                                />
                                <AvatarBadge/>
                            </Avatar>

                            <Heading size="lg" bold>
                                {me.data?.body?.firstName ?? ''}&nbsp;{me.data?.body?.lastName ?? ''}
                            </Heading>
                        </>}
                </HStack>

                {posts.isLoading ?
                    <Spinner/>
                    :
                    <VStack className="px-4 flex-1">
                        <FlatList
                            className='flex-1'
                            data={posts.data!!.body}
                            keyExtractor={(item) => `post-${item.id}`}
                            renderItem={({item}) => (
                                <PostView
                                    post={item}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            refreshing={isRefreshing}
                            onRefresh={refetch}
                        />
                    </VStack>}
            </VStack>
        </SafeAreaView>
    );
}
