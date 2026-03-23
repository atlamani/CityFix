import { IssueStatus } from "@/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusBadgeProps {
  status: IssueStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<
    IssueStatus,
    { bg: string; text: string; label: string }
  > = {
    reported: {
      bg: "#FEF3C7",
      text: "#92400E",
      label: "Reported",
    },

    "in-progress": {
      bg: "#DBEAFE",
      text: "#1D4ED8",
      label: "In Progress",
    },

    resolved: {
      bg: "#DCFCE7",
      text: "#166534",
      label: "Resolved",
    },
  };

  const style = config[status];

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.label, { color: style.text }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  label: {
    fontSize: 11,
    fontWeight: "600",
  },
});
