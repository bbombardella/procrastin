import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { z } from 'zod'

import { useSupabase } from '../../context/supabase-provider'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	error: {
		color: 'red',
		marginBottom: 10,
	},
})

const signupSchema = z.object({
	firstName: z.string().min(2, 'First name must be at least 2 characters long'),
	lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function SignUp() {
	const { signUp, signInWithPassword } = useSupabase()
	const [signUpError, setSignUpError] = useState<string | null>(null)

	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		mode: 'onChange',
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
		},
	})

	const onSubmit = async (data: z.infer<typeof signupSchema>) => {
		try {
			setSignUpError(null)

			await signUp(data.email, data.password)
			form.reset()

			await signInWithPassword(data.email, data.password)
		} catch (error: Error | any) {
			setSignUpError(error?.message)
			console.log(error.message)
		}
	}

	return (
		<View style={styles.container}>
			<Text>Prénom</Text>
			<Controller
				control={form.control}
				name="firstName"
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						style={styles.input}
						autoCapitalize="words"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
					/>
				)}
			/>
			{form.formState.errors.firstName && <Text style={styles.error}>{form.formState.errors.firstName.message}</Text>}

			<Text>Nom</Text>
			<Controller
				control={form.control}
				name="lastName"
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						style={styles.input}
						autoCapitalize="words"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
					/>
				)}
			/>
			{form.formState.errors.lastName && <Text style={styles.error}>{form.formState.errors.lastName.message}</Text>}

			<Text>Email</Text>
			<Controller
				control={form.control}
				name="email"
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						style={styles.input}
						keyboardType="email-address"
						autoCapitalize="none"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
					/>
				)}
			/>
			{form.formState.errors.email && <Text style={styles.error}>{form.formState.errors.email.message}</Text>}

			<Text>Mot de passe</Text>
			<Controller
				control={form.control}
				name="password"
				render={({ field: { onChange, onBlur, value } }) => (
					<TextInput
						style={styles.input}
						secureTextEntry
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
					/>
				)}
			/>
			{form.formState.errors.password && <Text style={styles.error}>{form.formState.errors.password.message}</Text>}

			{signUpError && <Text style={styles.error}>{signUpError}</Text>}

			<Button title="S'inscrire" onPress={form.handleSubmit(onSubmit)} disabled={!form.formState.isValid} />
		</View>
	)
}
