import {KeyboardAvoidingView, Platform, RefreshControl, ScrollView} from 'react-native';
import {useSupabase} from '../../../context/supabase-provider';
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
import {useState} from 'react';
import {useToast} from '../../../components/ui/toast';
import {SuccessToast} from '../../../components/ui/success-toast';
import {ErrorToast} from '../../../components/ui/error-toast';
import {Text} from '../../../components/ui/text';
import {Link} from 'expo-router';

const userInfoSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
    description: z.string().max(500, 'Description must not exceed 500 characters').default(''),
    profilePictureUrl: z.string()
})

export default function Profile() {
    const {signOut} = useSupabase()
    const toast = useToast()

    const [toastId, setToastId] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false)

    const fetchUserInfo = async () => {
        setLoading(true)
        const {body} = await queryClient.users.getUser.query({params: {id: '1'}})
        setLoading(false)

        return {
            firstName: body.firstName,
            lastName: body.lastName,
            description: body.description,
            profilePictureUrl: body.profilePictureUrl
        }
    }

    const form = useForm<z.infer<typeof userInfoSchema>>({
        resolver: zodResolver(userInfoSchema),
        mode: 'onChange',
        defaultValues: async () => {
            return await fetchUserInfo()
        },
    })

    async function disconnect() {
        try {
            await signOut()
        } catch (error: Error | any) {
            console.log(error.message)
        }
    }

    const showNewToast = (message: string, error: boolean = false) => {
        const uniqueToastId = `toast-edit-profile-${Math.random()}`
        setToastId(uniqueToastId)
        toast.show({
            id: uniqueToastId,
            placement: "top",
            duration: 5000,
            render: ({id}) => {
                if (error) {
                    return <ErrorToast uniqueToastId={id} message={message} onClose={() => toast.close(uniqueToastId)}/>
                } else {
                    return <SuccessToast uniqueToastId={id} message={message}/>
                }
            }
        })
    }

    const handleSubmit = async (data: z.infer<typeof userInfoSchema>) => {
        try {
            setRefreshing(true)
            const {body} = await queryClient.users.updateUser.mutation({
                params: {id: '1'},
                body: {...data}
            })

            form.reset({
                firstName: body.firstName,
                lastName: body.lastName,
                description: body.description,
                profilePictureUrl: body.profilePictureUrl
            })

            showNewToast('Profile edited successfully!')
        } catch (error: Error | any) {
            showNewToast(error.message, true)
            console.error(error.message)
        } finally {
            setSubmitting(false)
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
                                <Avatar size="xl">
                                    <AvatarFallbackText>{form.getValues(['firstName', 'lastName']).join(' ')}</AvatarFallbackText>
                                    <AvatarImage
                                        source={{
                                            uri: form.getValues('profilePictureUrl'),
                                        }}
                                    />
                                    <AvatarBadge/>
                                </Avatar>
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
