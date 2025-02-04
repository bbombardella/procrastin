import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export default function Post({ id, profileName, imageUrl, description }: { id: string, profileName: string, imageUrl: string, description: string }) {
    const navigation = useNavigation();
    const [liked, setLiked] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.profileName}>{profileName}</Text>
            <Image style={styles.postImage} source={{ uri: imageUrl }} />
            <Text style={styles.description}>{description}</Text>
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => setLiked(!liked)}>
                <MaterialIcons name={liked ? "favorite" : "favorite-border"} size={24} color={liked ? "red" : "black"} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialIcons name="add-comment" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
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
    profileName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    postImage: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#333",
        marginBottom: 8,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 5,
    }
});
