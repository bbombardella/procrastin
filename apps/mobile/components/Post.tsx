import { Image, StyleSheet, Text, View, TouchableOpacity, useColorScheme } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Link } from "expo-router";
import { IconSymbol } from "./ui/IconSymbol";

export default function Post({ id, profileName, imageUrl, description }) {
    const [liked, setLiked] = useState(false);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
            <Text style={[styles.profileName, isDarkMode && styles.textDark]}>{profileName}</Text>
            <Image style={styles.postImage} source={{ uri: imageUrl }} />
            <Text style={[styles.description, isDarkMode && styles.textDark]}>{description}</Text>
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => setLiked(!liked)}>
                    <MaterialIcons name={liked ? "favorite" : "favorite-border"} size={24} color={liked ? "red" : (isDarkMode ? "white" : "black")} />
                </TouchableOpacity>
                <Link href='/postDetails'>
                    <IconSymbol size={24} color={isDarkMode ? "white" : "black"} name="plus.bubble"/>
                </Link>
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
    containerDark: {
        backgroundColor: "#282828",
        shadowColor: "#000",
        shadowOpacity: 0.3,
    },
    profileName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "black",
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
    },
    textDark: {
        color: "#fff",
    }
});
