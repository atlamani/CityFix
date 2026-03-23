import { RootStackParamList } from "@/app/App";
import { authStore } from "@/auth-store";
import { issueStore } from "@/store";
import { IssueCategory } from "@/types";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image";
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
  const [category, setCategory] = useState<IssueCategory>("pothole");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = authStore.getCurrentUser();

    if (!user) {
      navigation.replace("Login");
    }
  }, [navigation]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access photos is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setError("");
    const currentUser = authStore.getCurrentUser();

    if (!currentUser) {
      navigation.replace("Login");
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

    const newIssue = issueStore.addIssue({
      category,
      description,
      photo: photoUri,
      status: "reported",
      location,
      reportedBy: currentUser.id,
    });

    setIsSubmitting(false);
    navigation.replace("IssueDetail", { id: newIssue.id });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>Back to Issues</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Report an Issue</Text>
      <Text style={styles.subtitle}>
        Help Improve your Community by reporting problems that need attention
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.sectionLabel}>Select Category *</Text>
      <View style={styles.categoriesRow}>
        {categories.map(({ value, label, icon }) => {
          const active = category === value;
          return (
            <TouchableOpacity
              key={value}
              style={[styles.categoryCard, active && styles.categoryCardActive]}
              onPress={() => setCategory(value)}
            >
              <Feather
                name={icon}
                size={18}
                color={active ? "#1D4ED8" : "#4B5563"}
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
        style={styles.input}
      />

      <Text style={styles.sectionLabel}>Description *</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Provide details about the issue"
        style={[styles.input, styles.textArea]}
      />

      <Text style={styles.sectionLabel}>{description.length} characters</Text>

      <Text style={styles.sectionLabel}>Photo *</Text>
      <TouchableOpacity style={styles.photoBox} onPress={handlePickImage}>
        {photoUri ? (
          <>
            <Image source={{ uri: photoUri }} style={styles.photo} />
            <Text style={styles.photoHint}>Tap to change photo</Text>
          </>
        ) : (
          <>
            <Feather name="camera" size={28} color={"#6B7280"} />
            <Text style={styles.photoHint}>Tap to upload a photo</Text>
            <Text style={styles.photoSubHint}>PNG, JPG</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.submitLabel}>Submit Report</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  backLink: {
    color: "#2563EB",
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },

  error: {
    color: "#DC2626",
    marginBottom: 8,
    fontSize: 13,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginTop: 12,
    marginBottom: 4,
  },

  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  categoryCardActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  categoryLabel: {
    marginLeft: 6,
    fontSize: 12,
    color: "#4B5563",
  },

  categoryLabelActive: {
    color: "#1D4ED8",
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#FFF",
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  charCount: {
    alignSelf: "flex-end",
    marginTop: 4,
    fontSize: 11,
    color: "#9CA3AF",
  },

  photoBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  photo: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  photoHint: {
    fontSize: 13,
    color: "#4B5563",
  },

  photoSubHint: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: "#2563EB",
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
    opacity: 0.7,
  },
});
