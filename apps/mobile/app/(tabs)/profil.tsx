import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useState } from 'react';
import { ThemedText } from '../../components/ThemedText';

export default function Profil() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        // Ici, vous pouvez ajouter la logique pour envoyer les données au backend
        Alert.alert('Succès', 'Profil mis à jour avec succès !');
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={(
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="chevron.left.forwardslash.chevron.right"
                    style={styles.headerImage}
                />
            )}
        >
            <View style={styles.container}>
                <ThemedText type="defaultSemiBold" style={styles.title}>
                    Modifier mon profil
                </ThemedText>

                <View style={styles.inputContainer}>
                    <ThemedText type="default">Nom</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Votre nom"
                        autoCapitalize="words"
                    />

                    <ThemedText type="default">Adresse email</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Votre email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <ThemedText type="default">Nouveau mot de passe</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Nouveau mot de passe"
                        secureTextEntry
                    />

                    <ThemedText type="default">Confirmer le mot de passe</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirmer le mot de passe"
                        secureTextEntry
                    />

                    <View style={styles.buttonContainer}>
                        <Button 
                            title="Enregistrer les modifications"
                            onPress={handleSubmit}
                        />
                    </View>
                </View>
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    inputContainer: {
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    buttonContainer: {
        marginTop: 20,
    }
});