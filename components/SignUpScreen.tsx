import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../App";
import { authStore } from "../auth-store";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const handleSubmit = () => {
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    setIsloading(true);
    setTimeout(() => {
      const result = authStore.signUp({
        email,
        phoneNumber,
        username,
        password,
      });

      if (result.success) {
        if (navigation?.replace) {
          navigation.replace("Home");
        } else {
          router.replace("/(tabs)");
        }
      } else {
        setError(result.error || "Sign up failed");
      }
      setIsloading(false);
    }, 500);
  };

  const handleBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      router.back();
    }
  };

  const handleAlreadyHaveAccount = () => {
    if (navigation?.replace) {
      navigation.replace("Login");
    } else {
      router.replace("/");
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.brandRow}>
        <Ionicons
          name="warning-outline"
          size={56}
          color="#1E63F7"
          style={styles.brandIcon}
        />
        <Text style={styles.brandText}>CityFix</Text>
      </View>

      <Text style={styles.subtitle}>
        Join your community in making a difference
      </Text>

      <View style={styles.card}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.8}>
          <Text style={styles.backLink}>← Back to Login</Text>
        </TouchableOpacity>

        <Text style={styles.cardTitle}>Create Account</Text>
        <Text style={styles.cardSubtitle}>
          Sign up to start reporting issues
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email Address *</Text>
        <View style={styles.inputWrap}>
          <Ionicons
            name="mail-outline"
            size={22}
            color="#A1A9B8"
            style={styles.inputIcon}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#8B95A7"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>Phone Number *</Text>
        <View style={styles.inputWrap}>
          <Ionicons
            name="call-outline"
            size={22}
            color="#A1A9B8"
            style={styles.inputIcon}
          />
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="555-0123"
            placeholderTextColor="#8B95A7"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>Username *</Text>
        <View style={styles.inputWrap}>
          <Ionicons
            name="person-outline"
            size={22}
            color="#A1A9B8"
            style={styles.inputIcon}
          />
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            placeholderTextColor="#8B95A7"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        <Text style={styles.helperText}>At least 3 characters</Text>

        <Text style={styles.label}>Password *</Text>
        <View style={styles.inputWrap}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#A1A9B8"
            style={styles.inputIcon}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor="#8B95A7"
            secureTextEntry
            style={styles.input}
          />
          <Ionicons
            name="eye-outline"
            size={22}
            color="#A1A9B8"
            style={styles.trailingIcon}
          />
        </View>
        <Text style={styles.helperText}>At least 6 characters</Text>

        <Text style={styles.label}>Confirm Password *</Text>
        <View style={styles.inputWrap}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#A1A9B8"
            style={styles.inputIcon}
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            placeholderTextColor="#8B95A7"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.9}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAlreadyHaveAccount}
          activeOpacity={0.85}
        >
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.footerLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#D9E8F8",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: "center",
  },

  brandRow: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },

  brandIcon: {
    marginRight: 10,
    marginTop: -1,
  },

  brandText: {
    color: "#111827",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  subtitle: {
    color: "#475569",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 26,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 24,
    shadowColor: "#94A3B8",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 7,
  },

  backLink: {
    color: "#1E63F7",
    fontSize: 17,
    marginBottom: 18,
    fontWeight: "500",
  },

  cardTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },

  cardSubtitle: {
    fontSize: 18,
    color: "#475569",
    marginBottom: 22,
    lineHeight: 26,
  },

  error: {
    color: "#DC2626",
    marginBottom: 10,
    fontSize: 13,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginTop: 10,
    marginBottom: 8,
  },

  inputWrap: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#D7DDE8",
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  inputIcon: {
    marginRight: 10,
  },

  trailingIcon: {
    marginLeft: 10,
  },

  input: {
    flex: 1,
    borderWidth: 0,
    paddingVertical: 12,
    fontSize: 17,
    color: "#0F172A",
    backgroundColor: "transparent",
  },

  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },

  primaryButton: {
    marginTop: 24,
    backgroundColor: "#1E63F7",
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  footerText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#475569",
  },

  footerLink: {
    color: "#1E63F7",
    fontWeight: "700",
  },
});
