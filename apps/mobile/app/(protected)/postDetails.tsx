import { FlatList, Image, StyleSheet, Text, View, useColorScheme } from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context';

const post = {
    profileName: "John Doe",
    imageUrl: "https://picsum.photos/200/300?grayscale",
    description: "Voici un superbe post avec une belle image.",
    comments: [
        { id: "1", profileName: "Alice", content: "Superbe photo !" },
        { id: "2", profileName: "Bob", content: "Magnifique, j'adore !" },
        { id: "3", profileName: "Charlie", content: "Où as-tu pris cette photo ?" },
    ],
};

export default function PostDetails() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
            <Text style={[styles.profileName, isDarkMode && styles.textDark]}>
                {post.profileName}
            </Text>
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            <Text style={[styles.description, isDarkMode && styles.textDark]}>
                {post.description}
            </Text>
            <Text style={[styles.commentTitle, isDarkMode && styles.textDark]}>
                Commentaires :
            </Text>
            <FlatList
                data={post.comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.commentContainer, isDarkMode && styles.commentContainerDark]}>
                        <Text style={[styles.commentProfile, isDarkMode && styles.textDark]}>
                            {item.profileName}
                        </Text>
                        <Text style={[styles.commentContent, isDarkMode && styles.commentContentDark]}>
                            {item.content}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    containerDark: {
        backgroundColor: "#121212",
        shadowColor: "#000",
        shadowOpacity: 0.3,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#000",
    },
    postImage: {
        width: "100%",
        height: 250,
        borderRadius: 10,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#333",
        marginBottom: 10,
    },
    commentTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 10,
        color: "#000",
    },
    commentContainer: {
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    commentContainerDark: {
        backgroundColor: "#282828",
    },
    commentProfile: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#000",
    },
    commentContent: {
        fontSize: 14,
        color: "#555",
    },
    // Styles pour le mode sombre
    textDark: {
        color: "#fff",
    },
    commentContentDark: {
        color: "#BEBEBE",
    },
});
