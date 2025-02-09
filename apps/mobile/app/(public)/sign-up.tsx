import {zodResolver} from '@hookform/resolvers/zod'
import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native'
import {z} from 'zod'

import {useSupabase} from '../../context/supabase-provider'
import {VStack} from '../../components/ui/vstack';
import {Heading} from '../../components/ui/heading';
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText
} from '../../components/ui/form-control';
import {Input, InputField, InputIcon, InputSlot} from '../../components/ui/input';
import {EyeIcon, EyeOffIcon} from '../../components/ui/icon';
import {Button, ButtonText} from '../../components/ui/button';
import {HStack} from '../../components/ui/hstack';
import {useToast} from '../../components/ui/toast';
import {queryClient} from '../../libs/http';
import {Textarea, TextareaInput} from '../../components/ui/textarea';
import {showNewToast} from '../../helper/show-toast.function';

const signupSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
    description: z.string().max(500, 'Description must not exceed 500 characters').default(''),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function SignUp() {
    const {signUp} = useSupabase()
    const toast = useToast()

    const [toastId, setToastId] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            description: '',
            email: '',
            password: '',
        },
    })

    const onSubmit = async ({firstName, lastName, description, email, password}: z.infer<typeof signupSchema>) => {
        try {
            await signUp(email, password)

            const result = await queryClient.users.createUser.mutation(
                {
                    body: {
                        firstName,
                        lastName,
                        email,
                        description,
                        profilePictureUrl: ''
                    }
                }
            )

            if (result?.status === 201) {
                form.reset()
            } else {
                showNewToast(toast, 'Error while creating the account', setToastId, true)
            }
        } catch (error: Error | any) {
            showNewToast(toast, error.message, setToastId, true)
            console.error(error.message)
        }
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}}
                              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                              keyboardVerticalOffset={100}>
            <ScrollView>
                <VStack className="w-full p-4">
                    <Heading className="text-center my-4" size="5xl">ProcrastIn</Heading>

                    <Heading className="text-center my-4 mb-8" size="lg">Here we go!</Heading>

                    <View>
                        <HStack space="sm">
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
                                                       onBlur={onBlur} />
                                    </Textarea>
                                    <FormControlHelper>
                                        <FormControlHelperText>Provide a short description about yourself (must not exceed 500 characters).</FormControlHelperText>
                                    </FormControlHelper>
                                    <FormControlError>
                                        <FormControlErrorText>
                                            {form.formState.errors.description?.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                </FormControl>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="email"
                            render={({field: {onChange, onBlur, value}}) => (
                                <FormControl
                                    isInvalid={!!form.formState.errors.email}
                                    size="md"
                                    isRequired={true}
                                    className="mt-4"
                                >
                                    <FormControlLabel>
                                        <FormControlLabelText>Email</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input className="my-1" size="lg">
                                        <InputField
                                            type="text"
                                            placeholder="Your email"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                    </Input>
                                    <FormControlError>
                                        <FormControlErrorText>
                                            {form.formState.errors.email?.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                </FormControl>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="password"
                            render={({field: {onChange, onBlur, value}}) => (
                                <FormControl
                                    className="mt-2"
                                    isInvalid={!!form.formState.errors.password}
                                    size="md"
                                    isRequired={true}
                                >
                                    <FormControlLabel>
                                        <FormControlLabelText>Password</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input className="my-1" size="lg">
                                        <InputField
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Your password"
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                        <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                                            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon}/>
                                        </InputSlot>
                                    </Input>
                                    <FormControlHelper>
                                        <FormControlHelperText>
                                            Must be at least 6 characters.
                                        </FormControlHelperText>
                                    </FormControlHelper>
                                    <FormControlError>
                                        <FormControlErrorText>
                                            {form.formState.errors.password?.message}
                                        </FormControlErrorText>
                                    </FormControlError>
                                </FormControl>
                            )}
                        />

                        <Button className="w-full mt-4" size="md" onPress={form.handleSubmit(onSubmit)}>
                            <ButtonText>Sign up</ButtonText>
                        </Button>
                    </View>
                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
