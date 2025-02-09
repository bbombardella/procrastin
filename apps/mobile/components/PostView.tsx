import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {useState} from "react";
import {Link} from "expo-router";
import {VStack} from "./ui/vstack";
import {HStack} from "./ui/hstack";
import {Text} from "./ui/text";
import {Dimensions, Image, Pressable} from "react-native";
import {Box} from "./ui/box";
import {PostWithAuthor} from "@procrastin/prisma";
import {PostHeader} from './PostHeader';

export default function PostView({post}: { post: PostWithAuthor }) {
    const [liked, setLiked] = useState(false)

    return (
        <VStack className="w-full p-4" space="md">
            <PostHeader date={post.createdAt} author={post.author} size="sm"/>
            <VStack>
                <Text>
                    {post.content}
                </Text>
                <Box className="w-full items-center">
                    <Image
                        source={{uri: post.mediaUrl}}
                        style={{
                            width: Dimensions.get('window').width - 50,
                            height: undefined,
                            aspectRatio: 16 / 9,
                            marginVertical: 10,
                        }}
                        resizeMode="cover"
                    />
                </Box>
                <HStack
                    className="w-full items-center justify-start"
                    space="xl"
                >
                    <Pressable onPress={() => setLiked(!liked)}>
                        <MaterialIcons
                            name={liked ? "favorite" : "favorite-border"}
                            size={24}
                            color={liked ? "red" : "grey"}
                        />
                    </Pressable>

                    <Link href={`/postDetails/${post.id}`}>
                        <MaterialIcons
                            name="chat-bubble-outline"
                            size={24}
                            color={"grey"}
                        />
                    </Link>
                </HStack>
            </VStack>
        </VStack>
    );
}
