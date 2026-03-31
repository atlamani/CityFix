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
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={handleBack}>
        <Text style={styles.backLink}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Join Your Community</Text>
      <Text style={styles.subtitle}>Sign Up to Start Reporting Issues</Text>

      <View style={styles.card}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="123-456-7890"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Your Username"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Your Password"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter Password"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAlreadyHaveAccount}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.footerLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  backLink: {
    color: "#93C5FD",
    marginBottom: 12,
  },

  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },

  subtitle: {
    color: "#CBD5F5",
    fontSize: 14,
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
  },

  error: {
    color: "#DC2626",
    marginBottom: 8,
    fontSize: 13,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },

  primaryButton: {
    marginTop: 16,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  footerText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    color: "#4B5563",
  },

  footerLink: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
