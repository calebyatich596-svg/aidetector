export type DetectionResult = {
  label: string;
  confidence: number;
  risk_level: string;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Result: { result: DetectionResult };
};
