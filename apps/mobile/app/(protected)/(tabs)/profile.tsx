import {Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text} from 'react-native';
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
import {EditIcon, LockIcon} from '../../../components/ui/icon';
import {Button, ButtonIcon, ButtonText} from '../../../components/ui/button';
import {Spinner} from '../../../components/ui/spinner';
import {queryClient} from '../../../libs/http';
import {Heading} from '../../../components/ui/heading';

const userInfoSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
    description: z.string().max(500, 'Description must not exceed 500 characters').default(''),
})

export default function Profile() {
    const {signOut} = useSupabase()
    const {data, isLoading, isError} = queryClient.users.getUser.useQuery(['tmp'])

    const form = useForm<z.infer<typeof userInfoSchema>>({
        resolver: zodResolver(userInfoSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            description: '',
        },
    })

    async function disconnect() {
        try {
            await signOut()
        } catch (error: Error | any) {
            console.log(error.message)
        }
    }

    const handleSubmit = () => {
        Alert.alert('Succès', 'Profil mis à jour avec succès !');
    };

    return (
        <KeyboardAvoidingView style={{flex: 1}}
                              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                              keyboardVerticalOffset={100}>
            <ScrollView>
                <VStack className="w-full p-4">
                    {isLoading && <Spinner size="large"/>}

                    {isError && <Heading className="text-center" size="3xl">Oops...</Heading>}

                    {!isLoading && !isError &&
                        <>
                            <HStack className="gap-4 items-center">
                                <Avatar size="xl">
                                    <AvatarFallbackText>Jane Doe</AvatarFallbackText>
                                    <AvatarImage
                                        source={{
                                            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
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

                            <Button className="w-full mt-4" size="md" action="positive"
                                    onPress={form.handleSubmit(handleSubmit)}>
                                <ButtonIcon as={EditIcon} className="mr-2"/>
                                <ButtonText>Edit my profile!</ButtonText>
                            </Button>

                            <Button className="w-full mt-4" size="md" action="secondary" onPress={disconnect}>
                                <ButtonIcon as={LockIcon} className="mr-2"/>
                                <ButtonText>Log out</ButtonText>
                            </Button>
                        </>
                    }
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
