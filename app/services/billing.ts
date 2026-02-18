import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";
import API from "./api";

export async function openSubscriptionCheckout() {
  const { data } = await API.post("/billing/subscription/mobile-session");

  const init = await initPaymentSheet({
    merchantDisplayName: "VerifiAI",
    paymentIntentClientSecret: data.payment_intent_client_secret,
    customerEphemeralKeySecret: data.ephemeral_key,
    customerId: data.customer_id,
  });

  if (init.error) {
    throw new Error(init.error.message);
  }

  const presented = await presentPaymentSheet();
  if (presented.error) {
    throw new Error(presented.error.message);
  }

  return true;
}
