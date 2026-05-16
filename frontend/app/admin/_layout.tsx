import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="estimates" />
      <Stack.Screen name="create-estimate" />
      <Stack.Screen name="edit-estimate" />
      <Stack.Screen name="field-experts" />
      <Stack.Screen name="field-experts/create" />
      <Stack.Screen name="field-experts/[id]" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="window-types" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}