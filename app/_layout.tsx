import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="_modal" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="quiz_start" options={{ headerShown: false }} />
    </Stack>
  );
}