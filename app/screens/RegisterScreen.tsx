import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { register } from "../services/auth";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await register({ email, password });
      Alert.alert("Registration complete", "Please log in with your new account.");
      navigation.goBack();
    } catch {
      Alert.alert("Registration failed", "Unable to create account right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, gap: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 8 }}>Create your account</Text>
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
      <Button
        title={loading ? "Creating account..." : "Create account"}
        onPress={onRegister}
        disabled={loading}
      />
    </View>
  );
}
