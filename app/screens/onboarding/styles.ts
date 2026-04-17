import { StyleSheet } from "react-native";

export const onboardingStyles = StyleSheet.create({
  cardShadow: {
    elevation: 8,
    shadowColor: "#111418",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  glassPanel: {
    elevation: 10,
    shadowColor: "#111418",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  heroImage: {
    opacity: 0.8,
  },
  primaryButton: {
    elevation: 8,
    shadowColor: "#0A2238",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },
  sheetShadow: {
    elevation: 12,
    shadowColor: "#111418",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
});
