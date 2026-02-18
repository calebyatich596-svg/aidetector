import * as SecureStore from "expo-secure-store";
import API from "./api";

export type AuthPayload = {
  email: string;
  password: string;
};

export async function login({ email, password }: AuthPayload) {
  const response = await API.post("/auth/login", { email, password });
  await SecureStore.setItemAsync("token", response.data.token);
  await SecureStore.setItemAsync("biometric_enabled", "true");
  return response.data;
}

export async function register({ email, password }: AuthPayload) {
  const response = await API.post("/auth/register", { email, password });
  return response.data;
}

export async function logout() {
  await SecureStore.deleteItemAsync("token");
}

export async function getToken() {
  return SecureStore.getItemAsync("token");
}
