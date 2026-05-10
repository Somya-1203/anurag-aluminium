import { Stack } from 'expo-router';

export default function FieldExpertLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new-estimate" />
    </Stack>
  );
}