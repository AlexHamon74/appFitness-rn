import { Stack } from "expo-router";

export default function RootLayout() {
    return (

        <Stack>
            <Stack.Screen name="Accueil" options={{ title: "Mon Application" }} />
        </Stack>

    );
}
