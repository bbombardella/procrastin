import { Button, StyleSheet, View } from 'react-native'

import { useSupabase } from '../../context/supabase-provider'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
})

export default function MePage() {
	const { signOut } = useSupabase()

	async function disconnect() {
		try {
			await signOut()
		} catch (error: Error | any) {
			console.log(error.message)
		}
	}

	return (
		<View style={styles.container}>
			<Button title="Sign Out" onPress={disconnect} />
		</View>
	)
}
