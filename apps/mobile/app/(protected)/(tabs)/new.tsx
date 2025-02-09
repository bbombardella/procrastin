import {Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Heading} from '../../../components/ui/heading';
import {z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText
} from '../../../components/ui/form-control';
import {Input, InputField} from '../../../components/ui/input';
import {VStack} from '../../../components/ui/vstack';
import {Textarea, TextareaInput} from '../../../components/ui/textarea';
import {Button, ButtonIcon, ButtonSpinner, ButtonText} from '../../../components/ui/button';
import {AddIcon, PlayIcon} from '../../../components/ui/icon';
import {useBottomTabOverflow} from '../../../components/ui/TabBarBackground';
import {useState} from 'react';
import {queryClient} from '../../../libs/http';
import {useToast} from '../../../components/ui/toast';
import {showNewToast} from '../../../helper/show-toast.function';
import {useRouter} from 'expo-router';

const postSchema = z.object({
    title: z.string().min(1, 'Please provide a title'),
    content: z.string().min(1, 'Please provide a description'),
    media: z.object({
        uri: z.string().min(1, 'Please provide an image'),
        type: z.string().optional(),
        name: z.string().optional()
    })
})

export default function NewPostScreen() {
    const bottom = useBottomTabOverflow()
    const toast = useToast()
    const router = useRouter()

    const [toastId, setToastId] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: '',
            content: '',
            media: undefined
        },
    })

    const showToast = showNewToast

    const handleSubmit = async (data: z.infer<typeof postSchema>) => {
        setSubmitting(true)

        try {
            const formData = new FormData()
            // @ts-expect-error: special react native format for form data
            formData.append('file', data.media)
            const file = await queryClient.files.uploadFile.mutation({
                body: formData,
                extraHeaders: {"Content-Type": "multipart/form-data"}
            })

            if (file.status !== 200) {
                if (file.status === 500 && file.body === 'request file too large') {
                    showNewToast(toast, 'Failed to upload profile picture. File is too large.', setToastId, true)
                } else {
                    showNewToast(toast, 'Failed to upload profile picture.', setToastId, true)
                }

                return;
            }

            const result = await queryClient.posts.createPost.mutation({
                body: {
                    title: data.title,
                    content: data.content,
                    mediaUrl: file.body
                }
            })

            if (result.status === 201) {
                showToast(toast, 'Post created successfully!', setToastId)
                form.reset()

                router.navigate('/(protected)/(tabs)')
            } else {
                throw new Error('An error ocurred while creating the post.')
            }
        } catch (error: Error | any) {
            showToast(toast, error.message, setToastId, true)
            console.error(error.message)
        } finally {
            setSubmitting(false)
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const asset = result.assets[0]
                form.setValue('media', {
                    uri: asset.uri,
                    type: asset.mimeType ?? 'image/jpeg',
                    name: asset.fileName ?? asset.uri.split("/").pop() ?? 'profile-picture.jpg'
                }, {shouldDirty: true})
            }
        } catch (error: Error | any) {
            showToast(toast, `Une erreur est survenue lors de la sélection de l'image : ${error.message}`, setToastId, true)
            console.error(error.message)
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView style={{flex: 1}}
                                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={{paddingBottom: bottom}}>
                    <VStack className="w-full p-4">
                        <Heading className="text-center" size="3xl">Create a new post</Heading>

                        <Button className="mt-10" size="md"
                                onPress={pickImage}>
                            <ButtonIcon as={PlayIcon} className="mr-2"/>
                            <ButtonText>Choose an image</ButtonText>
                        </Button>

                        {form.watch('media.uri') &&
                            <Image source={{uri: form.watch('media.uri')}} style={styles.postImage}/>}

                        <Controller
                            control={form.control}
                            name="title"
                            render={({field: {onChange, onBlur, value}}) => (
                                <FormControl
                                    isInvalid={!!form.formState.errors.title}
                                    size="md"
                                    isRequired={true}
                                    className="mt-4"
                                >
                                    <FormControlLabel>
                                        <FormControlLabelText>Title</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input className="my-1" size="lg">
                                        <InputField
                                            type="text"
                                            placeholder="Post's title"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    </Input>
                                    <FormControlError>
                                        <FormControlErrorText>
                                            {form.formState.errors.title?.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                </FormControl>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="content"
                            render={({field: {onChange, onBlur, value}}) => (
                                <FormControl
                                    isInvalid={!!form.formState.errors.content}
                                    isRequired={true}
                                    size="md"
                                    className="mt-4"
                                >
                                    <FormControlLabel>
                                        <FormControlLabelText>Content</FormControlLabelText>
                                    </FormControlLabel>
                                    <Textarea
                                        size="lg"
                                        className="my-1"
                                        style={{height: 300}}
                                    >
                                        <TextareaInput placeholder="Post's content"
                                                       textAlignVertical="top"
                                                       value={value}
                                                       onChangeText={onChange}
                                                       style={{height: 300}}
                                                       onBlur={onBlur}/>
                                    </Textarea>
                                    <FormControlHelper>
                                        <FormControlHelperText>Describe your feelings!</FormControlHelperText>
                                    </FormControlHelper>
                                    <FormControlError>
                                        <FormControlErrorText>
                                            {form.formState.errors.content?.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                </FormControl>
                            )}
                        />

                        <Button className="mt-4" size="md" action="positive"
                                isDisabled={!form.formState.isDirty || !form.formState.isValid || submitting}
                                onPress={form.handleSubmit(handleSubmit)}>
                            {submitting ?
                                <ButtonSpinner/>
                                :
                                <ButtonIcon as={AddIcon} className="mr-2"/>
                            }
                            <ButtonText>Create my post!</ButtonText>
                        </Button>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    postImage: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginTop: 10,
        resizeMode: "cover",
    }
});
