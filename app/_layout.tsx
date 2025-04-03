import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Liste des exercices" }} />
            <Stack.Screen name="timer_param" options={{ title: "Paramètres chrono" }} />
        </Stack>
    );
}
