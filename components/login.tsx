import { Ionicons } from "@expo/vector-icons";
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

import { RootStackParamList } from "@/App";
import { authStore } from "@/auth-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const goHome = () => {
    if (navigation?.replace) {
      navigation.replace("Home");
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSubmit = () => {
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const result = authStore.login(email, password);

      if (result.success) {
        goHome();
      } else {
        setError(result.error || "Login Failed");
      }

      setIsLoading(false);
    }, 500);
  };

  const handleBrowseAsGuest = () => {
    goHome();
  };

  const handleSignUpNavigate = () => {
    if (navigation?.navigate) {
      navigation.navigate("SignUp");
    } else {
      router.push("/SignUp");
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
        <View style={styles.brandIconWrap}>
          <Ionicons name="warning-outline" size={56} color="#1E63F7" />
        </View>
        <Text style={styles.title}>CityFix</Text>
      </View>

      <Text style={styles.subtitle}>Report and track community issues</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome Back</Text>
        <Text style={styles.cardSubtitle}>
          Sign in to your account to continue
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="mail-outline"
              size={28}
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
          <Text style={styles.helperText}>Try: demo@cityfix.com</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={28}
              color="#A1A9B8"
              style={styles.inputIcon}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#8B95A7"
              secureTextEntry={true}
              style={styles.input}
            />
            <Ionicons
              name="eye-outline"
              size={28}
              color="#A1A9B8"
              style={styles.trailingIcon}
            />
          </View>
          <Text style={styles.helperText}>Demo password: demo123</Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.9}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignUpNavigate} activeOpacity={0.85}>
          <Text style={styles.footerText}>
            Don{"'"}t have an account?{" "}
            <Text style={styles.footerLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleBrowseAsGuest}
        style={styles.secondaryButton}
        activeOpacity={0.9}
      >
        <Text style={styles.secondaryButtonText}>Browse Issues as Guest</Text>
      </TouchableOpacity>

      <Text style={styles.hintText}>
        Guests can view issues but cannot report, vote, or comment
      </Text>
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
    paddingTop: 56,
    paddingBottom: 36,
    justifyContent: "center",
  },

  brandRow: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 18,
  },

  brandIconWrap: {
    marginRight: 8,
    marginTop: 2,
  },

  title: {
    color: "#111827",
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  subtitle: {
    color: "#475569",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 34,
    lineHeight: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 30,
    shadowColor: "#94A3B8",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 7,
  },

  cardTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
  },

  cardSubtitle: {
    fontSize: 20,
    color: "#475569",
    marginBottom: 28,
    lineHeight: 28,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 19,
    color: "#1E293B",
    marginBottom: 10,
    fontWeight: "700",
  },

  inputWrap: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: "#D3DAE7",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },

  inputIcon: {
    marginRight: 10,
  },

  trailingIcon: {
    marginLeft: 10,
  },

  input: {
    flex: 1,
    color: "#0F172A",
    fontSize: 20,
    paddingVertical: 0,
  },

  helperText: {
    marginTop: 8,
    fontSize: 16,
    color: "#475569",
  },

  primaryButton: {
    marginTop: 20,
    backgroundColor: "#1E63F7",
    minHeight: 78,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  footerText: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 18,
    color: "#475569",
  },

  footerLink: {
    color: "#1E63F7",
    fontWeight: "700",
  },

  secondaryButton: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    minHeight: 78,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D3DAE7",
    shadowColor: "#94A3B8",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },

  secondaryButtonText: {
    color: "#1E293B",
    fontSize: 20,
    fontWeight: "700",
  },

  hintText: {
    marginTop: 24,
    fontSize: 18,
    color: "#475569",
    textAlign: "center",
    lineHeight: 26,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 8,
  },
});
