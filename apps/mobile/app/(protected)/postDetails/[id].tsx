import { useGlobalSearchParams } from "expo-router";
import { FlatList, Image, StyleSheet } from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
import { Text } from "../../../components/ui/text";
import { VStack } from "../../../components/ui/vstack";
import { HStack } from "../../../components/ui/hstack";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../../components/ui/avatar";
import { Box } from "../../../components/ui/box";
import CommentView from "../../../components/CommentView";
import { FormControl, FormControlLabel, FormControlLabelText } from "../../../components/ui/form-control";
import { Input, InputField } from "../../../components/ui/input";
import React from "react";
import { Button, ButtonText } from "../../../components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const post = {
    id: 1, // Ajouté un ID pour le post
    profileName: "John Doe",
    imageUrl: "https://picsum.photos/200/300?grayscale",
    description: "Voici un superbe post avec une belle image.",
    createdAt: new Date(), // Date de création
    updatedAt: new Date(), // Date de mise à jour
    comments: [
      { 
        id: 2, // ID du commentaire sous forme numérique
        createdAt: new Date(), // Date de création du commentaire
        updatedAt: new Date(), // Date de mise à jour du commentaire
        content: "Superbe photo !",
        authorId: 1, // ID de l'auteur, exemple
        postId: 1, // ID du post auquel appartient ce commentaire
      },
      { 
        id: 3, 
        createdAt: new Date(),
        updatedAt: new Date(),
        content: "Magnifique, j'adore !",
        authorId: 2, // ID de l'auteur
        postId: 1, 
      },
      { 
        id: 4, 
        createdAt: new Date(),
        updatedAt: new Date(),
        content: "Où as-tu pris cette photo ?",
        authorId: 3, // ID de l'auteur
        postId: 1,
      },
    ],
  };

const addCommentSchema = z.object({
    comment: z.string().min(2, 'Comment must be at least 2 characters long'),
    
})


export default function PostDetails() {
    const idPost = useGlobalSearchParams();

    const [isInvalid, setIsInvalid] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const form = useForm<z.infer<typeof addCommentSchema>>({
            resolver: zodResolver(addCommentSchema),
            mode: 'onChange',
            defaultValues: {
                comment: ''
            },
        })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            //TODO
            form.reset()
        } catch (error: Error | any) {
            console.log(error.message)
        }
    }


    return (
        <SafeAreaView >
            <VStack className="p-4">
                <HStack alignItems="center" space="lg">
                    <Avatar size="lg">
                        <AvatarFallbackText>{post.authorId}</AvatarFallbackText>
                        <AvatarImage
                            source={{
                                uri: `https://picsum.photos/id/${200+post.id}/12/12`,
                            }}
                        />
                    </Avatar>
                    <Text>
                        {post.id}
                    </Text>
                </HStack>
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                <Text style={styles.description}>
                    {post.description}
                </Text>
                <Text bold size="lg">
                    Commentaires :
                </Text>
                
                <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
                <FormControl
                    isInvalid={isInvalid}
                    size="md"
                >
                    <FormControlLabel>
                    <FormControlLabelText>Commentaire</FormControlLabelText>
                    </FormControlLabel>
                    <Input className="my-1" >
                    <InputField
                        type="text"
                        placeholder="..."
                        value={inputValue}
                        onChangeText={(text) => setInputValue(text)}
                    />
                    </Input>
                </FormControl>
                <Button className="w-full mt-4" size="md" onPress={form.handleSubmit(onSubmit)}>
                    <ButtonText>Sign up</ButtonText>
                </Button>
                </VStack>

                <FlatList
                    data={post.comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CommentView comment={item} />
                    )}
                />
            </VStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    postImage: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        marginVertical: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    commentTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 10,
    },
    commentContainer: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    commentProfile: {
        fontSize: 14,
    },
    commentContent: {
        fontSize: 14,
    },
});
