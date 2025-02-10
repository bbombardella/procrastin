import {useLocalSearchParams, useNavigation} from "expo-router";
import {Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from "../../../components/ui/text";
import {VStack} from "../../../components/ui/vstack";
import CommentView from "../../../components/CommentView";
import {FormControl, FormControlError, FormControlErrorText} from "../../../components/ui/form-control";
import {Input, InputField} from "../../../components/ui/input";
import React, {useEffect, useState} from "react";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {queryClient} from '../../../libs/http';
import {Spinner} from '../../../components/ui/spinner';
import {PostHeader} from '../../../components/PostHeader';
import {Divider} from '../../../components/ui/divider';
import {HStack} from '../../../components/ui/hstack';
import {Button, ButtonSpinner, ButtonText} from '../../../components/ui/button';
import {Heading} from '../../../components/ui/heading';
import {showNewToast} from '../../../helpers/show-toast.function';
import {useToast} from '../../../components/ui/toast';

const addCommentSchema = z.object({
    comment: z.string().min(2, 'Comment must be at least 2 characters long'),
})

export default function PostDetails() {
    const navigation = useNavigation()
    const {id}: { id: string } = useLocalSearchParams()
    const toast = useToast()

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [_, setToastId] = useState<string>('')

    const {isLoading, data} = queryClient.posts.getPost.useQuery([`post-details-${id}`], {params: {id}})

    const form = useForm<z.infer<typeof addCommentSchema>>({
        resolver: zodResolver(addCommentSchema),
        defaultValues: {
            comment: ''
        },
    })

    useEffect(() => {
        if (data?.body?.title) {
            navigation.setOptions({
                title: data.body.title
            })
        }
    }, [data]);

    async function onSubmit(formData: z.infer<typeof addCommentSchema>) {
        if (!data) {
            return;
        }

        try {
            setIsSubmitting(true)
            const result = await queryClient.comments.createComment.mutation({
                body: {
                    content: formData.comment,
                    post: {
                        connect: {
                            id: data.body.id
                        }
                    }
                }
            })

            if (result.status === 201) {
                data.body.comments.unshift(result.body)
                form.reset()
                showNewToast(toast, 'Your comment has been sent!', setToastId)
            } else {
                showNewToast(toast, 'Error while sending your comment', setToastId, true)
            }
        } catch (error: Error | any) {
            showNewToast(toast, error.message, setToastId, true)
            console.error(error.message)
        } finally {
            Keyboard.dismiss()
            setIsSubmitting(false)
        }
    }


    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView style={{flex: 1}}
                                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                  keyboardVerticalOffset={100}>
                {isLoading ?
                    <Spinner/>
                    :
                    <VStack className="flex-1">
                        <ScrollView>
                            <VStack className="flex-1 gap-4 p-4">
                                {data?.body?.author &&
                                    <PostHeader date={data!!.body.createdAt} author={data!!.body.author} size="lg"/>}
                                <Image source={{uri: data!!.body.mediaUrl}} style={styles.postImage}/>
                                <Text style={styles.description}>
                                    {data!!.body.content}
                                </Text>

                                <Divider/>

                                <Heading bold size="lg">
                                    Comments
                                </Heading>

                                {data!!.body.comments.length ?
                                    data!!.body.comments.map(item => (
                                        <CommentView key={`comment-${item.id}`} comment={item}/>
                                    ))
                                    :
                                    <Text>No comments available. Be the first to react!</Text>
                                }
                            </VStack>
                        </ScrollView>

                        <VStack>
                            <Divider/>
                            <HStack className="p-4 my-2 items-center gap-4">
                                <Controller
                                    control={form.control}
                                    name="comment"
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <FormControl
                                            isInvalid={!!form.formState.errors.comment}
                                            size="md"
                                            className="flex-1"
                                        >
                                            <Input size="lg">
                                                <InputField
                                                    type="text"
                                                    placeholder="Comment this post"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                />
                                            </Input>
                                            <FormControlError>
                                                <FormControlErrorText>
                                                    {form.formState.errors.comment?.message}
                                                </FormControlErrorText>
                                            </FormControlError>
                                        </FormControl>
                                    )}
                                />

                                <Button size="md" variant="outline"
                                        isDisabled={isSubmitting}
                                        onPress={form.handleSubmit(onSubmit)}>
                                    {isSubmitting ?
                                        <ButtonSpinner/>
                                        :
                                        <ButtonText>Comment</ButtonText>
                                    }
                                </Button>
                            </HStack>
                        </VStack>
                    </VStack>
                }
            </KeyboardAvoidingView>
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
