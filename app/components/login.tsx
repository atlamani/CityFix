import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app";
import { authStore } from "../auth-store";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const result = authStore.login(email, password);

      if (result.success) {
        navigation.replace("Home");
      } else {
        setError(result.error || "Login Failed");
      }

      setIsLoading(false);
    }, 500);
  };

  const handleBrowseAsGuest = () => {
    //
    navigation.replace("Home");
  };

  const handleSignUpNavigate = () => {
    // SignUp Screen here
    // navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CityFix</Text>
      <Text style={styles.subtitle}>Report and track community issues</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign in</Text>
        <Text style={styles.cardSubtitle}>
          Sign in to your account to continue
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter Password"
            secureTextEntry={!showPassword}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBrowseAsGuest}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Browse as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignUpNavigate}>
          <Text style={styles.footerText}>
            Don&apos;t have an account?{" "}
            <Text style={styles.footerLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.hintText}>
          Guests can View Issues but Cannot Report, Vote, or Comment.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    color: "#CBD5F5",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },

  field: {
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  primaryButton: {
    marginTop: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  secondaryButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  secondaryButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 8,
  },

  footerText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    color: "#4B5563",
  },

  footerLink: {
    color: "#2563EB",
    fontWeight: "600",
  },

  hintText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});
