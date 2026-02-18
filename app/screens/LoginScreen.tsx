import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { login } from "../services/auth";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      navigation.replace("Dashboard");
    } catch {
      Alert.alert("Login failed", "Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 8 }}>Sign in to VerifiAI</Text>
      <Text>Email</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8 }}
      />
      <Button title={loading ? "Logging in..." : "Login"} onPress={onLogin} disabled={loading} />
      <Button title="Create account" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
