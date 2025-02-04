import { useState } from 'react';
import { Alert, TouchableOpacity, Image, StyleSheet, TextInput, View, Text, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../../components/ThemedText';

export default function NewPostScreen() {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<string | null>(null);

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const handleSubmit = () => {
        if (!description) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }
        Alert.alert("Succès", "Votre post a été créé !");
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
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
            <ThemedText type="defaultSemiBold" style={[styles.title, isDarkMode && styles.textDark]}>
                Créer un Nouveau Post
            </ThemedText>

            <TextInput
                style={[styles.input, styles.textArea, isDarkMode && styles.inputDark]}
                placeholder="Description du post"
                placeholderTextColor={isDarkMode ? "#bbb" : "#666"}
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TouchableOpacity style={[styles.button, isDarkMode && styles.buttonDark]} onPress={pickImage}>
                <Text style={styles.buttonText}>Choisir une image</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.postImage} />}

            <TouchableOpacity style={[styles.button, styles.publishButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Publier</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    containerDark: {
        backgroundColor: "#121212",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: "#000",
        fontWeight: "bold",
    },
    textDark: {
        color: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: "#fff",
        color: "#000",
        width: "100%",
    },
    inputDark: {
        borderColor: "#555",
        backgroundColor: "#222",
        color: "#fff",
    },
    textArea: {
        height: 120,
        textAlignVertical: "top",
    },
    postImage: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginTop: 10,
        resizeMode: "cover",
    },
    button: {
        marginTop: 15,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: "#007BFF",
        width: "100%",
        alignItems: "center",
    },
    buttonDark: {
        backgroundColor: "#333333",
    },
    publishButton: {
        backgroundColor: "#28a745",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
