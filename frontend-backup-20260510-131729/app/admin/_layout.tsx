import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="estimates" />
      <Stack.Screen name="edit-estimate" />
      <Stack.Screen name="window-types" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}