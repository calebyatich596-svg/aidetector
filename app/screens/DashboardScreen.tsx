import React, { useState } from "react";
import { Alert, Button, Image, ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import API from "../services/api";
import { logout } from "../services/auth";
import { openSubscriptionCheckout } from "../services/billing";
import { DetectionResult, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "Gallery permission is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const captureImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const analyze = async () => {
    if (!image) {
      Alert.alert("No image selected", "Please choose or capture an image first.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "image",
        {
          uri: image.uri,
          type: image.mimeType ?? "image/jpeg",
          name: image.fileName ?? "upload.jpg",
        } as never,
      );

      const response = await API.post<DetectionResult>("/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigation.navigate("Result", { result: response.data });
    } catch {
      Alert.alert("Analysis failed", "Could not complete detection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startSubscription = async () => {
    try {
      setLoading(true);
      await openSubscriptionCheckout();
      Alert.alert("Success", "Subscription checkout completed.");
    } catch {
      Alert.alert("Payment failed", "Unable to complete subscription checkout.");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    await logout();
    navigation.replace("Login");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Dashboard</Text>
      <Button title="Pick from gallery" onPress={pickImage} />
      <Button title="Capture with camera" onPress={captureImage} />
      {image ? (
        <Image source={{ uri: image.uri }} style={{ width: "100%", height: 280, borderRadius: 12 }} />
      ) : null}
      <Button title={loading ? "Analyzing..." : "Analyze image"} onPress={analyze} disabled={loading} />
      <Button
        title={loading ? "Opening checkout..." : "Manage subscription"}
        onPress={startSubscription}
        disabled={loading}
      />
      <Button title="Logout" onPress={onLogout} color="#d62828" />
    </ScrollView>
  );
}
