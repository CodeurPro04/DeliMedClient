import { Stack } from "expo-router";
import { CartProvider } from "./context/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pharmacy/[id]" />
        <Stack.Screen name="order/prescription" />
        <Stack.Screen name="order/products" />
      </Stack>
    </CartProvider>
  );
}
