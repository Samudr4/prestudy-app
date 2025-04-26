import React, { useEffect, useState } from 'react';
import { Stack } from "expo-router";



export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="otp_verification" options={{ headerShown: false }} />
      <Stack.Screen name="category_details" options={{ headerShown: false }} />
      <Stack.Screen name="quiz_details" options={{ headerShown: false }} />
      <Stack.Screen name="quiz_start" options={{ headerShown: false }} />
      <Stack.Screen name="quiz_results" options={{ headerShown: false }} />
      <Stack.Screen name="quiz_answers" options={{ headerShown: false }} />
      <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="declaration_screen" options={{ headerShown: false }} />
    </Stack>
  );
}