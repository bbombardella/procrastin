import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Link } from "expo-router";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { Dimensions, Image, Pressable } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Box } from "./ui/box";

export default function Post({ id, profileName, imageUrl, description }) {
    const [liked, setLiked] = useState(false);

    return (
        <VStack className="w-full p-4" space="md">
            <HStack 
                space="sm" 
                alignItems="center"
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
            <VStack>
                <Text>
                    {description}
                </Text>
                <Box
                    className="w-full"
                    alignItems="center"
                >
                <Image
                    source={{ uri: imageUrl }}
                    style={{
                        width: Dimensions.get('window').width-50,
                        height: undefined,
                        aspectRatio: 16 / 9,
                        marginVertical: 10,
                      }}
                    
                    resizeMode="cover" 
                />
                </Box>
                <HStack
                    className="w-full"
                    alignItems="center"
                    justifyContent="flex-start"
                    space="xl"
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
            </VStack>
        </VStack>
    );
}