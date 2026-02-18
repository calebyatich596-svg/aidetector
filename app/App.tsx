import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { StripeProvider } from "@stripe/stripe-react-native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ResultScreen from "./screens/ResultScreen";
import { authenticateWithBiometrics } from "./services/biometric";
import { registerForPushNotificationsAsync } from "./services/notifications";
import { RootStackParamList } from "./types";
import { STRIPE_PUBLISHABLE_KEY } from "./config";

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainNavigator({ initialRouteName }: { initialRouteName: "Login" | "Dashboard" }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "VerifiAI Login" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Create Account" }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState<"Login" | "Dashboard">("Login");

  useEffect(() => {
    async function bootstrap() {
      const enabled = await SecureStore.getItemAsync("biometric_enabled");
      const token = await SecureStore.getItemAsync("token");

      if (enabled === "true" && token) {
        const success = await authenticateWithBiometrics();
        if (success) {
          setInitialRouteName("Dashboard");
        } else {
          await SecureStore.deleteItemAsync("token");
          setInitialRouteName("Login");
        }
      }

      await registerForPushNotificationsAsync();
      setIsBooting(false);
    }

    bootstrap();
  }, []);

  if (isBooting) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <MainNavigator initialRouteName={initialRouteName} />
    </StripeProvider>
  );
}
