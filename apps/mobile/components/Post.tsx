import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Link } from "expo-router";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { Box } from "./ui/box";
import { Image } from "./ui/image";
import { Pressable } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";

export default function Post({ id, profileName, imageUrl, description }) {
    const [liked, setLiked] = useState(false);

    return (
        <VStack className="w-full pb-4" space="md">
            <HStack 
                space="sm" 
                alignItems="center"
                className="p-2"
            >
                <Avatar size="md">
                    <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                        <AvatarImage
                            source={{
                            uri: `https://picsum.photos/${200+id}`,
                            }}
                        />
                </Avatar>
                <Text size="md" bold>
                    {profileName}
                </Text>
            </HStack>
            <Box alignItems="center">
                <Image
                    source={{ uri: imageUrl }}
                    alt="postImage"
                    size="none"
                    className="aspect-[320/208] w-full max-w-[320px]"
                />
                <HStack
                    justifyContent="space-around"
                    alignItems="center"
                    className="p-2 w-full"
                >
                    <Pressable onPress={() => setLiked(!liked)}>
                        <MaterialIcons 
                            name={liked ? "favorite" : "favorite-border"} 
                            size={24} 
                            color={liked ? "red" : "white"} 
                        />
                    </Pressable>
                    
                    <Link href={`/postDetails`}>
                        <MaterialIcons 
                            name="chat-bubble-outline" 
                            size={24} 
                            color="white" 
                        />
                    </Link>
                </HStack> 
                <Text >
                    {description}
                </Text>
            </Box>
        </VStack>
    );
}