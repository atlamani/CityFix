import { RootStackParamList } from "@/App";
import { authStore } from "@/auth-store";
import { issueStore } from "@/store";
import { IssueCategory } from "@/types";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "ReportIssue">;

const categories: {
  value: IssueCategory;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { value: "pothole", label: "Pothole", icon: "alert-triangle" },
  { value: "streetlight", label: "Broken Streetlight", icon: "zap" },
  { value: "graffiti", label: "Graffiti", icon: "edit-3" },
  { value: "other", label: "Other", icon: "alert-circle" },
];

export default function ReportIssueScreen({ navigation }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState<IssueCategory>("pothole");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = authStore.getCurrentUser();

    if (!user) {
      if (navigation?.replace) {
        navigation.replace("Login");
      } else {
        router.replace("/");
      }
    }
  }, [navigation, router]);

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access photos is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
        setError("");
      }
    } catch (error) {
      console.error("Image picker error:", error);
      setError("Failed to pick image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    setError("");
    const currentUser = authStore.getCurrentUser();

    if (!currentUser) {
      if (navigation?.replace) {
        navigation.replace("Login");
      } else {
        router.replace("/");
      }
      return;
    }

    if (!photoUri) {
      setError("Please upload a photo of the issue");
      return;
    }

    if (!location.trim() || !description.trim()) {
      setError("Please fill out all required fields");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    issueStore.addIssue({
      category,
      description,
      photo: photoUri,
      status: "reported",
      location,
      reportedBy: currentUser.id,
    });

    setIsSubmitting(false);
    if (navigation?.replace) {
      navigation.replace("Home");
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (navigation?.goBack) {
            navigation.goBack();
          } else {
            router.back();
          }
        }}
        activeOpacity={0.85}
      >
        <Feather name="arrow-left" size={18} color="#2563EB" />
        <Text style={styles.backLink}>Back to Issues</Text>
      </TouchableOpacity>

      <View style={styles.formCard}>
        <Text style={styles.title}>Report an Issue</Text>
        <Text style={styles.subtitle}>
          Help improve your community by reporting problems that need attention
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.sectionLabel}>Select Category *</Text>
        <View style={styles.categoriesRow}>
          {categories.map(({ value, label, icon }) => {
            const active = category === value;
            return (
              <TouchableOpacity
                key={value}
                style={[
                  styles.categoryCard,
                  active && styles.categoryCardActive,
                ]}
                onPress={() => setCategory(value)}
                activeOpacity={0.85}
              >
                <Feather
                  name={icon}
                  size={18}
                  color={active ? "#2563EB" : "#111827"}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    active && styles.categoryLabelActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Location *</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Main Street & 5th Ave"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        <Text style={styles.sectionLabel}>Description *</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Provide details about the issue..."
          placeholderTextColor="#9CA3AF"
          style={[styles.input, styles.textArea]}
          multiline
        />

        <Text style={styles.charCount}>{description.length} characters</Text>

        <Text style={styles.sectionLabel}>Photo *</Text>
        <TouchableOpacity
          style={styles.photoBox}
          onPress={handlePickImage}
          activeOpacity={0.85}
        >
          {photoUri ? (
            <>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <Text style={styles.photoHint}>Tap to change photo</Text>
              <Text style={styles.photoSubHint}>PNG, JPG up to 10MB</Text>
            </>
          ) : (
            <>
              <Feather name="camera" size={42} color="#9CA3AF" />
              <Text style={styles.photoHint}>Click to upload a photo</Text>
              <Text style={styles.photoSubHint}>PNG, JPG up to 10MB</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.9}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitLabel}>Submit Report</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          CityFix - Report and track community issues
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    alignItems: "center",
  },

  backButton: {
    width: "100%",
    maxWidth: 700,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },

  backLink: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "500",
  },

  formCard: {
    width: "100%",
    maxWidth: 700,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 22,
    paddingVertical: 22,
  },

  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#6B7280",
    marginBottom: 22,
  },

  error: {
    color: "#DC2626",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "500",
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
    marginBottom: 8,
  },

  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  categoryCard: {
    width: "48%",
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8DDE6",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    gap: 10,
  },

  categoryCardActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  categoryLabel: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    flexShrink: 1,
  },

  categoryLabelActive: {
    color: "#1D4ED8",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D8DDE6",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FFF",
  },

  textArea: {
    minHeight: 130,
    textAlignVertical: "top",
  },

  charCount: {
    alignSelf: "flex-start",
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  photoBox: {
    width: "100%",
    minHeight: 268,
    borderWidth: 2,
    borderColor: "#D6DCE6",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  photo: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 14,
  },

  photoHint: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
    marginTop: 14,
  },

  photoSubHint: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
  },

  submitButton: {
    marginTop: 18,
    width: "100%",
    backgroundColor: "#D1D5DB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  submitLabel: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.8,
  },

  footer: {
    width: "100%",
    maxWidth: 700,
    paddingVertical: 26,
    alignItems: "center",
  },

  footerText: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
  },
});
