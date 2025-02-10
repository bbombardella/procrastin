import {KeyboardAvoidingView, Platform} from 'react-native';
import {VStack} from '../../components/ui/vstack';
import {Heading} from '../../components/ui/heading';
import {Controller, useForm} from 'react-hook-form';
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
import {ArrowLeftIcon, EyeIcon, EyeOffIcon, LockIcon} from '../../components/ui/icon';
import {z} from 'zod';
import {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button, ButtonIcon, ButtonSpinner, ButtonText} from '../../components/ui/button';
import {HStack} from '../../components/ui/hstack';
import {supabase} from '../../config/supabase';
import {showNewToast} from '../../helper/show-toast.function';
import {useToast} from '../../components/ui/toast';
import {useRouter} from 'expo-router';

const passwordEditionSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export default function PasswordEdition() {
    const router = useRouter()
    const toast = useToast()

    const [_, setToastId] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const form = useForm<z.infer<typeof passwordEditionSchema>>({
        resolver: zodResolver(passwordEditionSchema),
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const showToast = showNewToast

    const handleSubmit = async (data: z.infer<typeof passwordEditionSchema>) => {
        try {
            setSubmitting(true)
            await supabase.auth.updateUser({password: data.password})

            showToast(toast, 'Credentials successfully edited!', setToastId)
            goBack()
        } catch (error: Error | any) {
            showToast(toast, error?.message, setToastId, true)
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    const goBack = () => router.back()

    return (
        <KeyboardAvoidingView style={{flex: 1}}
                              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                              keyboardVerticalOffset={100}>
            <VStack className="w-full p-4">
                <Heading className="text-center" size="2xl">🔐&nbsp;Protected area</Heading>

                <Heading className="text-center mt-4" size="md">You're about to update your password, be
                    careful.</Heading>

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
                                    placeholder="Your new password"
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

                <Controller
                    control={form.control}
                    name="confirmPassword"
                    render={({field: {onChange, onBlur, value}}) => (
                        <FormControl
                            className="mt-2"
                            isInvalid={!!form.formState.errors.confirmPassword}
                            size="md"
                            isRequired={true}
                        >
                            <FormControlLabel>
                                <FormControlLabelText>Confirm password</FormControlLabelText>
                            </FormControlLabel>
                            <Input className="my-1" size="lg">
                                <InputField
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Retype your new password"
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                                <InputSlot className="pr-3"
                                           onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon}/>
                                </InputSlot>
                            </Input>
                            <FormControlHelper>
                                <FormControlHelperText>
                                    Must match your new password.
                                </FormControlHelperText>
                            </FormControlHelper>
                            <FormControlError>
                                <FormControlErrorText>
                                    {form.formState.errors.confirmPassword?.message}
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>
                    )}
                />

                <HStack className="gap-4 mt-4">
                    <Button className="flex-1" size="md" action="secondary"
                            onPress={goBack}>
                        <ButtonIcon as={ArrowLeftIcon} className="mr-2"/>
                        <ButtonText>Go back</ButtonText>
                    </Button>

                    <Button className="flex-1" size="md"
                            action="positive"
                            isDisabled={!form.formState.isDirty || !form.formState.isValid || submitting}
                            onPress={form.handleSubmit(handleSubmit)}>
                        {submitting ?
                            <ButtonSpinner/>
                            :
                            <ButtonIcon as={LockIcon} className="mr-2"/>
                        }
                        <ButtonText>Edit my password</ButtonText>
                    </Button>
                </HStack>
            </VStack>
        </KeyboardAvoidingView>
    )
}
