import React, { useState, useEffect } from "react";
import { Button, Modal, Pressable, StyleSheet, Text, TextInput, View, Keyboard, TouchableWithoutFeedback, Alert } from "react-native";

export default function Index() {
    const [nbSeries, setNbSeries] = useState(0);
    const [nbRepetitions, setNbRepetitions] = useState(0);
    const [exerciseName, setExerciseName] = useState("");
    const [restTime, setRestTime] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [currentSeries, setCurrentSeries] = useState(0);
    const [isResting, setIsResting] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else if (!isTimerRunning && timer !== 0) {
            clearInterval(interval!);
        }
        return () => clearInterval(interval!);
    }, [isTimerRunning]);

    useEffect(() => {
        if (isTimerRunning && currentSeries > 0) {
            let interval: NodeJS.Timeout | null = null;
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
                setNbRepetitions((prev) => Math.max(0, prev - 1)); // Decrement repetitions
            }, 1000);

            if (!isResting && timer >= nbRepetitions) {
                if (currentSeries < nbSeries) {
                    setIsResting(true);
                    setTimer(0);
                } else {
                    clearInterval(interval);
                    setIsTimerRunning(false);
                    setModalVisible(false);
                    Alert.alert("Bravo !");
                }
            } else if (isResting && timer >= parseInt(restTime)) {
                setIsResting(false);
                setTimer(0);
                setCurrentSeries((prev) => prev + 1);
            }

            return () => clearInterval(interval);
        }
    }, [isTimerRunning, timer, isResting, currentSeries]);

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

    const openModal = () => {
        setModalVisible(true);
    };

    const dataReset = () => {
        setNbSeries(0);
        setNbRepetitions(0);
        setExerciseName("");
        setRestTime("");
    };

    const startExercise = () => {
        setCurrentSeries(1);
        setIsTimerRunning(true);
        setIsResting(false);
        setTimer(0);
    };

    const stopExercise = () => {
        setIsTimerRunning(false);
        setTimer(0);
        setCurrentSeries(0);
        setIsResting(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    keyboardType="numeric"
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
                        onPress={dataReset}
                    />
                    {/* Bouton Start chrono */}
                    <Button
                        title="Lancer l'exercice"
                        accessibilityLabel="Lancer l'exercice"
                        color={"blue"}
                        onPress={openModal}
                    />
                </View>

                {/* Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View
                        style={[
                            styles.modalContainer,
                            { backgroundColor: isResting ? "green" : "orange" },
                        ]}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{exerciseName ? exerciseName : "Exercice en cours"}</Text>
                            <Text>{nbRepetitions} Réps</Text>
                            <Text>{restTime}s de repos</Text>
                            <Text>Série {currentSeries}/{nbSeries}</Text>
                            <Text style={styles.chrono}>{timer}s</Text>
                            <Text style={styles.statusText}>
                                {isResting ? "Pause" : "Go"}
                            </Text>
                            <View style={styles.row}>
                                <Button
                                    title="Fermer"
                                    onPress={() => {
                                        setModalVisible(false);
                                        stopExercise();
                                    }}
                                    color={"red"}
                                />
                                <Button
                                    title="Lancer"
                                    onPress={startExercise}
                                    color={"green"}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", margin: 20 },
    title: { fontSize: 30, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    inputText: { borderBlockColor: "black", borderWidth: 1, borderRadius: 100, height: 40, padding: 10, marginBottom: 20 },
    label: { marginBottom: 5 },
    row: { flexDirection: "row", justifyContent: "center", gap: 50, alignItems: "center", backgroundColor: "white", borderWidth: 1, borderRadius: 100, padding: 2, marginBottom: 20 },
    number: { fontSize: 20, fontWeight: "bold", marginBottom: 5, padding: 5 },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
    modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%", alignItems: "center" },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    chrono: { fontSize: 20, fontWeight: "bold", marginBottom: 20, marginTop: 20 },
    statusText: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
});
