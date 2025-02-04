import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function NewPostScreen() {
    const [profileName, setProfileName] = useState("");
    const [description, setDescription] = useState("");

     // Fonction pour soumettre le post
     const handleSubmit = () => {
        if (!profileName || !description) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        Alert.alert("Succès", "Votre post a été créé !");
        // Ici, tu peux envoyer les données à ton backend ou les ajouter à la liste des posts
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
            <ThemedText type="defaultSemiBold">Page pour créer un Post</ThemedText>
            <View style={styles.container}>
                <ThemedText type="defaultSemiBold">Créer un Nouveau Post</ThemedText>

                <TextInput
                    style={styles.input}
                    placeholder="Nom du profil"
                    value={profileName}
                    onChangeText={setProfileName}
                />

                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Description du post"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
                <Button title="Publier" onPress={handleSubmit} />
            </View>
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    container: {
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    imagePicker: {
        backgroundColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    previewImage: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
})
