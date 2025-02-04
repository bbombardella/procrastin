import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
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
	h1: {
		textAlign: 'center',
		fontSize: 20,
		fontWeight: 'bold',
	},
})

const formSchema = z.object({
	email: z.string().email('Please enter a valid email address.'),
	password: z
		.string()
		.min(8, 'Please enter at least 8 characters.')
		.max(64, 'Please enter fewer than 64 characters.'),
})

export default function SignIn() {
	const { signInWithPassword } = useSupabase()

	const [loginError, setLoginError] = useState<string | null>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			setLoginError(null)
			await signInWithPassword(data.email, data.password)

			form.reset()
		} catch (error: Error | any) {
			setLoginError(error?.message)
			console.log(error.message)
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.h1}>Sign In!</Text>
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

			{loginError && <Text style={styles.error}>{loginError}</Text>}

			<Button title="Se connecter" onPress={form.handleSubmit(onSubmit)} disabled={!form.formState.isValid} />

			<Link href="/sign-up" asChild>
				<Pressable>
					<Text>S'inscrire</Text>
				</Pressable>
			</Link>
		</View>
	)
}
