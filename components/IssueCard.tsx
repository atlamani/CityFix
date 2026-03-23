import { Issue } from "@/types";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CategoryIcon } from "./CategoryIcon";
import { StatusBadge } from "./StatusBadge";

interface IssueCardProps {
  issue: Issue;
  onPress?: () => void;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString();
}

export function IssueCard({ issue, onPress }: IssueCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: issue.photo }} style={styles.photo} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <CategoryIcon category={issue.category} showLabel />
          <StatusBadge status={issue.status} />
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {issue.description}
        </Text>
        <Text style={styles.location}>{issue.location}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.meta}>{formatDate(issue.createdAt)}</Text>
          <Text style={styles.meta}>
            {issue.votes} votes · {issue.comments.length} comments
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },

  photo: {
    width: "100%",
    height: 160,
  },

  content: {
    padding: 12,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },

  location: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  meta: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});
