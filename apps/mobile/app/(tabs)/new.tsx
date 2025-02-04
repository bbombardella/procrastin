import ParallaxScrollView from '../../components/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useState } from 'react';
import { Alert, Button, Image, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function NewPostScreen() {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<string | null>(null);

    // Fonction pour soumettre le post
    const handleSubmit = () => {
        if (!description) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        Alert.alert("Succès", "Votre post a été créé !");
        // Ici, tu peux envoyer les données à ton backend ou les ajouter à la liste des posts
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Erreur", "Une erreur est survenue lors de la sélection de l'image");
        }
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
            <ThemedText type="defaultSemiBold">Créer un Nouveau Post</ThemedText>
            <View style={styles.container}>
                <View style={styles.container}>
                    <Button title="Pick an image from camera roll" onPress={pickImage} />
                    {image && <Image source={{ uri: image }} style={styles.postImage} />}
                </View>

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
    );
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
    postImage: {
        backgroundColor: "#ddd",
        width: 200,
        height: 200,
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
});