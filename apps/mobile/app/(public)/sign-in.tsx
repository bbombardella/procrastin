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
import {Input, InputField} from '../../components/ui/input'
import {VStack} from '../../components/ui/vstack'
import {Center} from '../../components/ui/center';
import {Divider} from '../../components/ui/divider';
import {Link} from 'expo-router';

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

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            await signInWithPassword(data.email, data.password)

            form.reset()
        } catch (error: Error | any) {
            console.log(error.message)
        }
    }

    return (
        <VStack className="w-full p-4">
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
                        <Input className="my-1">
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
                        <Input className="my-1">
                            <InputField
                                type="password"
                                placeholder="Your password"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
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
                    <ButtonText>Login</ButtonText>
                </Button>
                <Divider className="my-4"/>

                <Button className="w-full" size="md" variant="outline" onPress={form.handleSubmit(onSubmit)}>
                    <Link href="/sign-up">Sign up</Link>
                </Button>
            </Center>
        </VStack>
    )
}
