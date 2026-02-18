import React from "react";
import { Button, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export default function ResultScreen({ route, navigation }: Props) {
  const { result } = route.params;

  return (
    <View style={{ flex: 1, padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Detection Result</Text>
      <Text>Label: {result.label}</Text>
      <Text>Confidence: {result.confidence}%</Text>
      <Text>Risk Level: {result.risk_level}</Text>
      <Button title="Analyze another image" onPress={() => navigation.replace("Dashboard")} />
    </View>
  );
}
