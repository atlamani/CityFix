import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IssueCategory } from "../types";

interface CategoryIconProps {
  category: IssueCategory;
  showLabel?: boolean;
}

export function CategoryIcon({
  category,
  showLabel = true,
}: CategoryIconProps) {
  const config: Record<
    IssueCategory,
    { icon: keyof typeof Feather.glyphMap; label: string; color: string }
  > = {
    pothole: { icon: "alert-triangle", label: "Pothole", color: "#F97316" },
    streetlight: {
      icon: "zap",
      label: "Broken Streetlight",
      color: "#FACC15",
    },
    graffiti: { icon: "edit-3", label: "Graffiti", color: "#22C55E" },
    other: { icon: "alert-circle", label: "Other Issue", color: "#3B82F6" },
  };

  const item = config[category];

  return (
    <View style={styles.container}>
      <Feather name={item.icon} size={18} color={item.color} />
      {showLabel && <Text style={styles.label}>{item.label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  label: {
    fontSize: 13,
    color: "#374151",
  },
});
