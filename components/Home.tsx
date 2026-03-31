import { RootStackParamList } from "@/App";
import { issueStore } from "@/store";
import { Issue } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [issues, setIssues] = useState<Issue[]>(issueStore.getIssues());
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues);

  useEffect(() => {
    const unsubscribe = issueStore.subscribe(() => {
      const updated = issueStore.getIssues();

      setIssues(updated);
      setFilteredIssues(updated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }: { item: Issue }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // navigation.navigate("IssueDetail", { id: item.id });
      }}
    >
      <Text style={styles.cardTitle}>{item.description}</Text>
      <Text style={styles.cardSubtitle}>{item.location}</Text>
      <Text style={styles.cardMeta}>
        {item.votes} votes • {item.comments.length} comments
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>CityFix</Text>
      <Text style={styles.headerSubtitle}>
        You can view reported issues, but you need an account to report, vote,
        or comment.
      </Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          Showing {filteredIssues.length} of {issues.length} issues
        </Text>
        <TouchableOpacity
          onPress={() => {
            //open filters, or navigate to ReportIssue
          }}
        >
          <Text style={styles.summaryLink}>Report Issue</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredIssues}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No issues found matching your filters.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  summaryText: {
    fontSize: 13,
    color: "#4B5563",
  },

  summaryLink: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
  },

  listContent: {
    paddingVertical: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },

  cardMeta: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  emptyText: {
    marginTop: 32,
    textAlign: "center",
    color: "#9CA3AF",
  },
});
