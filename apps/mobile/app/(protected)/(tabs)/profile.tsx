import {Alert, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, TouchableOpacity} from 'react-native';
import {useSupabase} from '../../../contexts/supabase-provider';
import {VStack} from '../../../components/ui/vstack';
import {Avatar, AvatarBadge, AvatarFallbackText, AvatarImage} from '../../../components/ui/avatar';
import {HStack} from '../../../components/ui/hstack';
import {z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
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
import {zodResolver} from '@hookform/resolvers/zod';
import {Textarea, TextareaInput} from '../../../components/ui/textarea';
import {CloseIcon, EditIcon, LockIcon} from '../../../components/ui/icon';
import {Button, ButtonIcon, ButtonSpinner, ButtonText} from '../../../components/ui/button';
import {Spinner} from '../../../components/ui/spinner';
import {queryClient} from '../../../libs/http';
import {useEffect, useState} from 'react';
import {useToast} from '../../../components/ui/toast';
import {Text} from '../../../components/ui/text';
import {Link} from 'expo-router';
import * as ImagePicker from 'expo-image-picker'
import {showNewToast} from '../../../helpers/show-toast.function';
import {useQueryClient} from '@tanstack/react-query';

const userInfoSchema = z.object({
    id: z.string(),
    firstName: z.string().min(2, 'First name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
    description: z.string().max(500, 'Description must not exceed 500 characters').default(''),
    profilePictureUrl: z.string().optional(),
    profilePictureSystem: z.object({
        uri: z.string().optional(),
        type: z.string().optional(),
        name: z.string().optional()
    }).optional()
})

export default function Profile() {
    const {signOut} = useSupabase()
    const toast = useToast()
    const client = useQueryClient()

    const [_, setToastId] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const fetchUserInfo = async () => {
        setLoading(true)
        const user = await queryClient.users.me.query()
        setLoading(false)

        if (user.status === 200) {
            return {
                id: String(user.body.id),
                firstName: user.body.firstName,
                lastName: user.body.lastName,
                description: user.body.description,
                profilePictureUrl: user.body.profilePictureUrl
            }
        } else {
            showNewToast(toast, 'Error while fetching your informations', setToastId, true)
            return {
                id: '',
                firstName: '',
                lastName: '',
                description: '',
                profilePictureUrl: ''
            }
        }
    }

    const form = useForm<z.infer<typeof userInfoSchema>>({
        resolver: zodResolver(userInfoSchema),
        mode: 'onChange',
        defaultValues: async () => fetchUserInfo(),
    })

    async function disconnect() {
        try {
            await signOut()
        } catch (error: Error | any) {
            showNewToast(toast, error.message, setToastId, true)
            console.error(error.message)
        }
    }

    useEffect(() => {
        form.formState.isValid
    }, [form.watch()]);

    const pickImage = async () => {
        try {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission requise", "Autorisez l'accès à la galerie pour sélectionner une image.");
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                const asset = result.assets[0]
                form.setValue('profilePictureSystem', {
                    uri: asset.uri,
                    type: asset.mimeType ?? 'image/jpeg',
                    name: asset.fileName ?? asset.uri.split("/").pop() ?? 'profile-picture.jpg'
                }, {shouldDirty: true})
            }
        } catch (error) {
            showNewToast(toast, 'An error occurred while selecting the image', setToastId, true)
            console.error('An error occurred while selecting the image')
        }
    }

    const handleSubmit = async (data: z.infer<typeof userInfoSchema>) => {
        try {
            setRefreshing(true)

            let fileUrl: string = data.profilePictureUrl
            if (data.profilePictureSystem) {
                const formData = new FormData()
                // @ts-expect-error: special react native format for form data
                formData.append('file', data.profilePictureSystem)
                const file = await queryClient.files.uploadFile.mutation({
                    body: formData,
                    extraHeaders: {"Content-Type": "multipart/form-data"}
                })

                if (file.status === 200) {
                    fileUrl = file.body
                } else {
                    if (file.status === 500 && file.body === 'request file too large') {
                        showNewToast(toast, 'Failed to upload profile picture. File is too large.', setToastId, true)
                    } else {
                        showNewToast(toast, 'Failed to upload profile picture.', setToastId, true)
                    }

                    form.setValue('profilePictureUrl', data.profilePictureUrl)
                }
            }

            const user = await queryClient.users.updateUser.mutation({
                params: {id: data.id},
                body: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    description: data.description,
                    profilePictureUrl: fileUrl
                }
            })

            if (user.status === 200) {
                form.reset({
                    id: String(user.body.id),
                    firstName: user.body.firstName,
                    lastName: user.body.lastName,
                    description: user.body.description,
                    profilePictureUrl: user.body.profilePictureUrl,
                })

                queryClient.users.me.setQueryData(client, [user.body.email], () => user)

                client.invalidateQueries({
                    queryKey: ['posts']
                })
            }

            showNewToast(toast, 'Profile edited successfully!', setToastId)
        } catch (error: Error | any) {
            showNewToast(toast, error.message, setToastId, true)
            console.error(error.message)
        } finally {
            setSubmitting(false)
            setRefreshing(false)
        }
    };

    const onRefresh = async () => form.reset(await fetchUserInfo())

    return (
        <KeyboardAvoidingView style={{flex: 1}}
                              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                              keyboardVerticalOffset={100}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }>
                <VStack className="w-full p-4">
                    {loading && <Spinner size="large"/>}

                    {!loading &&
                        <>
                            <HStack className="gap-4 items-center">
                                <TouchableOpacity onPress={pickImage}>
                                    <Avatar size="xl">
                                        <AvatarFallbackText>{form.getValues(['firstName', 'lastName']).join(' ')}</AvatarFallbackText>
                                        <AvatarImage
                                            source={{
                                                uri: form.watch('profilePictureSystem')?.uri ?? form.watch('profilePictureUrl'),
                                            }}
                                        />
                                        <AvatarBadge/>
                                    </Avatar>
                                </TouchableOpacity>
                                <VStack className="flex-1 gap-2">
                                    <Controller
                                        control={form.control}
                                        name="firstName"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <FormControl
                                                isInvalid={!!form.formState.errors.firstName}
                                                size="md"
                                                isRequired={true}
                                                className="flex-1"
                                            >
                                                <FormControlLabel>
                                                    <FormControlLabelText>First name</FormControlLabelText>
                                                </FormControlLabel>
                                                <Input className="my-1" size="lg">
                                                    <InputField
                                                        type="text"
                                                        placeholder="Your first name"
                                                        autoCapitalize="words"
                                                        autoComplete="given-name"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                    />
                                                </Input>
                                                <FormControlHelper>
                                                    <FormControlHelperText>
                                                        Must be at least 2 characters.
                                                    </FormControlHelperText>
                                                </FormControlHelper>
                                                <FormControlError>
                                                    <FormControlErrorText>
                                                        {form.formState.errors.firstName?.message}
                                                    </FormControlErrorText>
                                                </FormControlError>
                                            </FormControl>
                                        )}
                                    />

                                    <Controller
                                        control={form.control}
                                        name="lastName"
                                        render={({field: {onChange, onBlur, value}}) => (
                                            <FormControl
                                                isInvalid={!!form.formState.errors.lastName}
                                                size="md"
                                                isRequired={true}
                                                className="flex-1"
                                            >
                                                <FormControlLabel>
                                                    <FormControlLabelText>Last name</FormControlLabelText>
                                                </FormControlLabel>
                                                <Input className="my-1" size="lg">
                                                    <InputField
                                                        type="text"
                                                        placeholder="Your last name"
                                                        autoCapitalize="words"
                                                        autoComplete="family-name"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                    />
                                                </Input>
                                                <FormControlHelper>
                                                    <FormControlHelperText>
                                                        Must be at least 2 characters.
                                                    </FormControlHelperText>
                                                </FormControlHelper>
                                                <FormControlError>
                                                    <FormControlErrorText>
                                                        {form.formState.errors.lastName?.message}
                                                    </FormControlErrorText>
                                                </FormControlError>
                                            </FormControl>
                                        )}
                                    />
                                </VStack>
                            </HStack>

                            <Controller
                                control={form.control}
                                name="description"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <FormControl
                                        isInvalid={!!form.formState.errors.description}
                                        size="md"
                                        className="mt-4"
                                    >
                                        <FormControlLabel>
                                            <FormControlLabelText>Description</FormControlLabelText>
                                        </FormControlLabel>
                                        <Textarea
                                            size="lg"
                                            className="my-1"
                                        >
                                            <TextareaInput placeholder="A short description"
                                                           textAlignVertical="top"
                                                           value={value}
                                                           onChangeText={onChange}
                                                           onBlur={onBlur}/>
                                        </Textarea>
                                        <FormControlHelper>
                                            <FormControlHelperText>Provide a short description about yourself (must not
                                                exceed
                                                500 characters).</FormControlHelperText>
                                        </FormControlHelper>
                                        <FormControlError>
                                            <FormControlErrorText>
                                                {form.formState.errors.description?.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    </FormControl>
                                )}
                            />

                            <HStack className="gap-4 mt-4">
                                <Button className="flex-1" size="md" action="negative"
                                        onPress={() => form.reset()} isDisabled={!form.formState.isDirty}>
                                    <ButtonIcon as={CloseIcon} className="mr-2"/>
                                    <ButtonText>Reset</ButtonText>
                                </Button>

                                <Button className="flex-1" size="md" action="positive"
                                        isDisabled={!form.formState.isDirty || !form.formState.isValid || submitting}
                                        onPress={form.handleSubmit(handleSubmit)}>
                                    {submitting ?
                                        <ButtonSpinner/>
                                        :
                                        <ButtonIcon as={EditIcon} className="mr-2"/>
                                    }
                                    <ButtonText>Edit my profile!</ButtonText>
                                </Button>
                            </HStack>

                            <HStack className="gap-4 mt-4">
                                <Button className="flex-1" size="md" action="secondary">
                                    <ButtonIcon as={LockIcon} className="mr-2"/>

                                    <Link href="../passwordEdition">
                                        <Text className="font-medium">Edit my password</Text>
                                    </Link>
                                </Button>

                                <Button className="flex-1" size="md"
                                        action="primary" variant="outline" onPress={disconnect}>
                                    <ButtonText>Log out</ButtonText>
                                </Button>
                            </HStack>
                        </>
                    }
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
