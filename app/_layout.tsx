import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { CartProvider } from "./context/CartContext";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simuler un temps de chargement minimal
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Afficher un écran de chargement pendant l'initialisation
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#00A8E8" />
      </View>
    );
  }

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Écrans d'introduction */}
        <Stack.Screen name="index" />
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding-1" />
        <Stack.Screen name="onboarding-2" />
        <Stack.Screen name="onboarding-3" />
        
        {/* Authentification */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        
        {/* Application principale */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pharmacy/[id]" />
        <Stack.Screen name="order/prescription" />
        <Stack.Screen name="order/products" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="all-products" />
      </Stack>
    </CartProvider>
  );
}