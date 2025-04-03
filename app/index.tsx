import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { exercices } from "../data/Exercices";

export default function Index() {
    const navigation = useNavigation<NavigationProp<{ timer_param: { exerciseName: string } }>>();

    const renderExercise = ({ item }: { item: typeof exercices[0] }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("timer_param", { exerciseName: item.name })}
        >
            <Image style={styles.image} source={item.image} />
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={exercices}
                renderItem={renderExercise}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: "hidden",
        alignItems: "center",
    },
    image: {
        width: "90%",
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
        resizeMode: "contain",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: "#666",
    },
});
