import { StyleSheet, View, TextInput, Button, Alert, useColorScheme } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '../../../components/ThemedText';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSupabase} from '../../../context/supabase-provider';

export default function Profile() {
    const { signOut } = useSupabase()

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    async function disconnect() {
        try {
            await signOut()
        } catch (error: Error | any) {
            console.log(error.message)
        }
    }

    const handleSubmit = () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        Alert.alert('Succès', 'Profil mis à jour avec succès !');
    };

    return (
        <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
            <ThemedText type="defaultSemiBold" style={[styles.title, isDarkMode && styles.textDark]}>
                Modifier mon profil
            </ThemedText>

            <View style={styles.inputContainer}>
                <ThemedText type="default" style={isDarkMode && styles.textDark}>Nom</ThemedText>
                <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Votre nom"
                    placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
                    autoCapitalize="words"
                />

                <ThemedText type="default" style={isDarkMode && styles.textDark}>Adresse email</ThemedText>
                <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Votre email"
                    placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <ThemedText type="default" style={isDarkMode && styles.textDark}>Nouveau mot de passe</ThemedText>
                <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Nouveau mot de passe"
                    placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
                    secureTextEntry
                />

                <ThemedText type="default" style={isDarkMode && styles.textDark}>Confirmer le mot de passe</ThemedText>
                <TextInput
                    style={[styles.input, isDarkMode && styles.inputDark]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirmer le mot de passe"
                    placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
                    secureTextEntry
                />

                <View style={styles.buttonContainer}>
                    <Button 
                        title="Enregistrer les modifications"
                        onPress={handleSubmit}
                        color={isDarkMode ? "#bbb" : "#333333"}
                    />

                    <Button title="Sign Out" onPress={disconnect} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },
    containerDark: {
        backgroundColor: "#121212",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: "#000",
    },
    textDark: {
        color: "#fff",
    },
    inputContainer: {
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#fff",
        color: "#000",
        marginBottom: 15,
    },
    inputDark: {
        borderColor: "#555",
        backgroundColor: "#222",
        color: "#fff",
    },
    buttonContainer: {
        marginTop: 20,
		borderRadius: 12,
    }
});
