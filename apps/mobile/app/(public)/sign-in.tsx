import {zodResolver} from '@hookform/resolvers/zod'
import {Controller, useForm} from 'react-hook-form'
import {z} from 'zod'

import {useSupabase} from '../../context/supabase-provider'
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText
} from '../../components/ui/form-control'
import {Button, ButtonText} from '../../components/ui/button'
import {Input, InputField, InputIcon, InputSlot} from '../../components/ui/input'
import {VStack} from '../../components/ui/vstack'
import {Center} from '../../components/ui/center';
import {Divider} from '../../components/ui/divider';
import {Link} from 'expo-router';
import {Text} from '../../components/ui/text';
import {Heading} from '../../components/ui/heading';
import {View} from 'react-native';
import {useState} from 'react';
import {EyeIcon, EyeOffIcon} from '../../components/ui/icon';

const formSchema = z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z
        .string()
        .min(8, 'Please enter at least 8 characters.')
        .max(64, 'Please enter fewer than 64 characters.'),
})

export default function SignIn() {
    const {signInWithPassword} = useSupabase()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const [showPassword, setShowPassword] = useState(false)

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            await signInWithPassword(data.email, data.password)

            form.reset()
        } catch (error: Error | any) {
            console.log(error.message)
        }
    }

    return (
        <VStack className="w-full h-full p-4 justify-center">
            <Heading className="text-center my-4" size="5xl">ProcrastIn</Heading>

            <Heading className="text-center my-4 mb-8" size="lg">Please sign in to access the application.</Heading>

            <View>
                <Controller
                    control={form.control}
                    name="email"
                    render={({field: {onChange, onBlur, value}}) => (
                        <FormControl
                            isInvalid={!!form.formState.errors.email}
                            size="md"
                            isRequired={true}
                        >
                            <FormControlLabel>
                                <FormControlLabelText>Email</FormControlLabelText>
                            </FormControlLabel>
                            <Input className="my-1" size="lg">
                                <InputField
                                    type="text"
                                    placeholder="Your email"
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
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                />
                                <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
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

                <Center>
                    <Button className="w-full mt-4" size="md" onPress={form.handleSubmit(onSubmit)}>
                        <ButtonText>Sign in</ButtonText>
                    </Button>
                    <Divider className="my-4"/>

                    <Button className="w-full" size="md" variant="outline" onPress={form.handleSubmit(onSubmit)}>
                        <Link href="/sign-up">
                            <Text>Sign up</Text>
                        </Link>
                    </Button>
                </Center>
            </View>
        </VStack>
    )
}
