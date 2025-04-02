import React, { useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
    const [nbSeries, setNbSeries] = useState(0);
    const [nbRepetitions, setNbRepetitions] = useState(0);
    const [exerciseName, setExerciseName] = useState("");
    const [restTime, setRestTime] = useState("");

    const moinsSeries = () => {
        setNbSeries((prev) => Math.max(0, prev - 1));
    };

    const plusSeries = () => {
        setNbSeries((prev) => prev + 1);
    };

    const moinsRepetitions = () => {
        setNbRepetitions((prev) => Math.max(0, prev - 1));
    };

    const plusRepetitions = () => {
        setNbRepetitions((prev) => prev + 1);
    };

    const handleStartChrono = () => {
        Alert.alert(
            "Données de l'exercice",
            `Nom de l'exercice: ${exerciseName}\nNombre de séries: ${nbSeries}\nNombre de répétitions: ${nbRepetitions}\nTemps de repos: ${restTime}`
        );
    };

    const handleReset = () => {
        setNbSeries(0);
        setNbRepetitions(0);
        setExerciseName("");
        setRestTime("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue sur FitnessProspects!</Text>

            {/* Nom de l'exercice */}
            <Text style={styles.label} aria-label="Nom de l'exercice" nativeID="nbSerie">Nom de l'exercice</Text>
            <TextInput
                style={styles.inputText}
                placeholder="Entrez le nom de l'exercice..."
                value={exerciseName}
                onChangeText={setExerciseName}
            />

            {/* Nombre de séries */}
            <Text style={styles.label} aria-label="Nombre de série" nativeID="nbSerie">Nombre de séries</Text>
            <View style={styles.row}>
                <Pressable onPress={moinsSeries} accessibilityLabel="Moins une séries">
                    <Text style={styles.number}>-</Text>
                </Pressable>
                <Text>{nbSeries}</Text>
                <Pressable onPress={plusSeries} accessibilityLabel="Plus une séries">
                    <Text style={styles.number}>+</Text>
                </Pressable>
            </View>

            {/* Nombre de répétitions */}
            <Text style={styles.label} aria-label="Nombre de répétitions" nativeID="nbSerie">Nombre de répétitions</Text>
            <View style={styles.row}>
                <Pressable onPress={moinsRepetitions} accessibilityLabel="Moins une répétition">
                    <Text style={styles.number}>-</Text>
                </Pressable>
                <Text>{nbRepetitions}</Text>
                <Pressable onPress={plusRepetitions} accessibilityLabel="Plus une répétition">
                    <Text style={styles.number}>+</Text>
                </Pressable>
            </View>

            {/* Temps de repos */}
            <Text style={styles.label} aria-label="Temps de repos" nativeID="nbSerie">Temps de repos</Text>
            <TextInput
                style={styles.inputText}
                placeholder="Entrez votre temps de repos..."
                value={restTime}
                onChangeText={setRestTime}
            />
            <View style={styles.row}>
                {/* Bouton Reset */}
                <Button
                    title="Reset"
                    accessibilityLabel="Réinitialiser les champs"
                    color={"red"}
                    onPress={handleReset}
                />
                {/* Bouton Start chrono */}
                <Button
                    title="Lancer le chrono"
                    accessibilityLabel="Lancer le chrono"
                    color={"blue"}
                    onPress={handleStartChrono}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", margin: 20 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    inputText: { borderBlockColor: "black", borderWidth: 1, borderRadius: 100, height: 40, padding: 10, marginBottom: 20 },
    label: { marginBottom: 5 },
    row: { flexDirection: "row", justifyContent: "center", gap: 50, alignItems: "center", backgroundColor: "white", borderWidth: 1, borderRadius: 100, padding: 2, marginBottom: 20 },
    number: { fontSize: 20, fontWeight: "bold", marginBottom: 5, padding: 5 },
});
