import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

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
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="chevron.left.forwardslash.chevron.right"
                    style={styles.headerImage}
                />
            }
        >
            <View style={styles.container}>
                <Text style={styles.profileName}>{post.profileName}</Text>
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                <Text style={styles.description}>{post.description}</Text>
                <Text style={styles.commentTitle}>Commentaires :</Text>
                <FlatList
                    data={post.comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.commentContainer}>
                            <Text style={styles.commentProfile}>{item.profileName}</Text>
                            <Text style={styles.commentContent}>{item.content}</Text>
                        </View>
                    )}
                />
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerImage: {
        color: "#808080",
        bottom: -90,
        left: -35,
        position: "absolute",
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
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
    },
    commentContainer: {
        backgroundColor: "#F0F0F0",
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    commentProfile: {
        fontWeight: "bold",
        fontSize: 14,
    },
    commentContent: {
        fontSize: 14,
        color: "#555",
    },
});
