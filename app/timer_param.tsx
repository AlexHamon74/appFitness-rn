import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, TextInput, View, Alert, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";


export default function TimerParam({ route }: { route?: any }) {
    const exerciseName = route?.params?.exerciseName || "Exercice";
    const [nbSeries, setNbSeries] = useState("");
    const [nbRepetitions, setNbRepetitions] = useState("");
    const [repetitionTime, setRepetitionTime] = useState("");
    const [restTime, setRestTime] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [timer, setTimer] = useState(0);
    const [remainingReps, setRemainingReps] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [currentSeries, setCurrentSeries] = useState(0);
    const [isResting, setIsResting] = useState(false);

    const isFormValid = nbSeries && nbRepetitions && repetitionTime && restTime;

    const playBeepSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require("../assets/beep.mp3")
        );
        await sound.playAsync();
    };

    const playReadySound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require("../assets/ready.mp3")
        );
        await sound.playAsync();
    };

    const startCountdown = async () => {
        playReadySound(); // Play the sound immediately when the countdown starts
        for (let i = 3; i > 0; i--) {
            setTimer(i); // Display the countdown
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        setTimer(-1); // Set to -1 to indicate "Go!" should be displayed
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before starting the exercise
        startExercise();
    };

    const startExercise = () => {
        setCurrentSeries(1);
        setIsResting(false);
        setRemainingReps(parseInt(nbRepetitions));
        setTimer(parseInt(repetitionTime));
        setIsTimerRunning(true);
    };

    const stopExercise = () => {
        setIsTimerRunning(false);
        setTimer(0);
        setCurrentSeries(0);
        setRemainingReps(0);
        setIsResting(false);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0 && isTimerRunning) {
            if (!isResting) {
                if (remainingReps > 0) {
                    playBeepSound();
                    setTimer(parseInt(repetitionTime));
                    setRemainingReps((prev) => prev - 1);
                } else if (currentSeries < parseInt(nbSeries)) {
                    setIsResting(true);
                    setTimer(parseInt(restTime));
                } else {
                    setIsTimerRunning(false);
                    setModalVisible(false);
                    Alert.alert("Bravo !");
                }
            } else {
                setIsResting(false);
                setRemainingReps(parseInt(nbRepetitions));
                setTimer(parseInt(repetitionTime));
                setCurrentSeries((prev) => prev + 1);
            }
        }
        return () => clearInterval(interval!);
    }, [isTimerRunning, timer, isResting, remainingReps, currentSeries]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.title}>{exerciseName}</Text>

                <View style={[styles.card, styles.seriesCard]}>
                    <Text style={styles.label}>Nombre de séries</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Entrez le nombre de séries"
                        value={nbSeries}
                        onChangeText={setNbSeries}
                    />
                </View>

                <View style={[styles.card, styles.repetitionsCard]}>
                    <Text style={styles.label}>Nombre de répétitions</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Entrez le nombre de répétitions"
                        value={nbRepetitions}
                        onChangeText={setNbRepetitions}
                    />
                </View>

                <View style={[styles.card, styles.repetitionTimeCard]}>
                    <Text style={styles.label}>Temps d'une répétition (s)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Entrez le temps d'une répétition"
                        value={repetitionTime}
                        onChangeText={setRepetitionTime}
                    />
                </View>

                <View style={[styles.card, styles.restTimeCard]}>
                    <Text style={styles.label}>Temps de repos (s)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Entrez le temps de repos"
                        value={restTime}
                        onChangeText={setRestTime}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.startButton, !isFormValid && styles.disabledButton]}
                    onPress={() => setModalVisible(true)}
                    disabled={!isFormValid}
                >
                    <Text style={styles.startButtonText}>Lancer l'exercice</Text>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={[styles.modalContainer, isResting ? styles.restBackground : styles.exerciseBackground]}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalExerciseName}>{exerciseName}</Text>
                            <Text style={styles.modalSeries}>Série {currentSeries}/{nbSeries}</Text>

                            {isTimerRunning ? (
                                isResting ? (
                                    <Text style={styles.modalTimer}>{timer}s</Text>
                                ) : (
                                    <Text style={styles.modalTimerRep}>{remainingReps} répétitions restantes</Text>
                                )
                            ) : (
                                <>
                                    <Text style={styles.modalReady}>Ready?</Text>
                                    {!isTimerRunning && timer > 0 && (
                                        <Text style={styles.modalCountdown}>{timer}</Text>
                                    )}
                                    {!isTimerRunning && timer === -1 && (
                                        <Text style={styles.modalCountdown}>Go!</Text>
                                    )}
                                </>
                            )}

                            <Text style={styles.modalStatus}>
                                {isResting ? "Repos" : isTimerRunning ? "Effort" : ""}
                            </Text>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.stopButton]}
                                    onPress={() => {
                                        setModalVisible(false);
                                        stopExercise();
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>Stop</Text>
                                </TouchableOpacity>
                                {!isTimerRunning && (
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.startButton]}
                                        onPress={startCountdown}
                                    >
                                        <Text style={styles.modalButtonText}>Start</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30, color: "#333" },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    seriesCard: { borderLeftWidth: 5, borderLeftColor: "#2196F3" },
    repetitionsCard: { borderLeftWidth: 5, borderLeftColor: "#4CAF50" },
    repetitionTimeCard: { borderLeftWidth: 5, borderLeftColor: "#FFC107" },
    restTimeCard: { borderLeftWidth: 5, borderLeftColor: "#FF5722" },
    label: { fontSize: 18, marginBottom: 10, color: "#555" },
    input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, fontSize: 16, backgroundColor: "#f9f9f9" },
    startButton: {
        backgroundColor: "#2196F3",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: "#A5D6A7",
    },
    startButtonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 30,
        width: "90%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    exerciseBackground: { backgroundColor: "#FFCDD2" },
    restBackground: { backgroundColor: "#C8E6C9" },
    modalExerciseName: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 10, textAlign: "center" },
    modalSeries: { fontSize: 20, fontWeight: "600", color: "#555", marginBottom: 20 },
    modalTimer: { fontSize: 50, fontWeight: "bold", color: "#000", marginBottom: 20, textAlign: "center" },
    modalTimerRep: { fontSize: 30, fontWeight: "bold", color: "#000", marginBottom: 20, textAlign: "center" },
    modalReady: { fontSize: 40, fontWeight: "bold", color: "#000", marginBottom: 20, textAlign: "center" },
    modalCountdown: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 20,
        textAlign: "center",
    },
    modalStatus: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 30, textAlign: "center" },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 10,
    },
    stopButton: {
        backgroundColor: "#F44336",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
