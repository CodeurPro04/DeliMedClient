import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="pharmacy/[id]" />
      <Stack.Screen name="order/prescription" />
      <Stack.Screen name="order/products" />
    </Stack>
  );
}
