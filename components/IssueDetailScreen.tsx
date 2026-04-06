import { RootStackParamList } from "@/App";
import { authStore } from "@/auth-store";
import { issueStore } from "@/store";
import { Issue } from "@/types";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { CategoryIcon } from "./CategoryIcon";
import { StatusBadge } from "./StatusBadge";

type Props = NativeStackScreenProps<RootStackParamList, "IssueDetail">;

export default function IssueDetailScreen({ route, navigation }: Props) {
  const router = useRouter();
  const { id } = route.params;
  const [issue, setIssue] = useState<Issue | undefined>(
    issueStore.getIssue(id),
  );
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(authStore.getCurrentUser());

  const goHome = () => {
    if (navigation?.navigate) {
      navigation.navigate("Home");
    } else {
      router.replace("/(tabs)");
    }
  };

  const goLogin = () => {
    if (navigation?.navigate) {
      navigation.navigate("Login");
    } else {
      router.replace("/");
    }
  };

  useEffect(() => {
    const syncIssue = () => {
      setIssue(issueStore.getIssue(id));
      setCurrentUser(authStore.getCurrentUser());
    };

    const unsubscibeIssues = issueStore.subscribe(syncIssue);
    const unsubscibeAuth = authStore.subscribe(() => {
      setCurrentUser(authStore.getCurrentUser());
    });

    syncIssue();

    return () => {
      unsubscibeIssues();
      unsubscibeAuth();
    };
  }, [id]);

  const hasVoted = useMemo(() => {
    if (!currentUser || !issue) return false;
    return issue.votedBy.includes(currentUser.id);
  }, [currentUser, issue]);

  if (!issue) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Issue Not Found</Text>
        <Text style={styles.emptyText}>
          The issue you are looking for does not exist or has been removed.
        </Text>

        <TouchableOpacity style={styles.backButton} onPress={goHome}>
          <Feather name="arrow-left" size={16} color="#2563EB" />
          <Text style={styles.backButtonText}>Back to Issues</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleVote = () => {
    if (!currentUser) {
      goLogin();
      return;
    }

    issueStore.toggleVote(issue.id, currentUser.id);
    setIssue(issueStore.getIssue(id));
  };

  const handleCommentSubmit = () => {
    if (!currentUser) {
      goLogin();
      return;
    }

    const text = commentText.trim();
    if (!text) return;

    issueStore.addComment(issue.id, text, currentUser.username);
    setCommentText("");
    setIssue(issueStore.getIssue(id));
  };

  const commentSorted = [...issue.comments].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={goHome} style={styles.backLink}>
        <Feather name="arrow-left" size={16} color="#2563EB" />
        <Text style={styles.backLinkText}>Back to Issues</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Image source={{ uri: issue.photo }} style={styles.image} />

        <View style={styles.cardBody}>
          <View style={styles.rowBetween}>
            <CategoryIcon category={issue.category} />
            <StatusBadge status={issue.status} />
          </View>

          <Text style={styles.title}>{issue.description}</Text>

          <View style={styles.locationRow}>
            <Feather name="map-pin" size={18} color="#6B7280" />
            <Text style={styles.location}>{issue.location}</Text>
          </View>

          <Text style={styles.meta}>
            Reported on {formatDate(issue.createdAt)}
          </Text>

          <View style={styles.voteRow}>
            <TouchableOpacity
              style={[styles.voteButton, hasVoted && styles.voteButtonActive]}
              onPress={handleVote}
            >
              <Feather
                name="thumbs-up"
                size={18}
                color={hasVoted ? "#FFFFFF" : "#374151"}
              />
              <Text
                style={[
                  styles.voteButtonText,
                  hasVoted && styles.voteButtonTextActive,
                ]}
              >
                {hasVoted ? "Voted" : "Vote"}
              </Text>
              <Text
                style={[
                  styles.voteCount,
                  hasVoted && styles.voteButtonTextActive,
                ]}
              >
                {issue.votes}
              </Text>
            </TouchableOpacity>

            {!currentUser ? (
              <Text style={styles.loginHint}>
                <Text style={styles.loginLink} onPress={goLogin}>
                  Sign in
                </Text>{" "}
                to vote on this issue.
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.commentsCard}>
        <Text style={styles.sectionTitle}>
          Comments ({issue.comments.length})
        </Text>

        {currentUser ? (
          <View style={styles.commentForm}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Share updates or ask questions..."
              style={styles.textArea}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.postButton,
                !commentText.trim() && styles.buttonDisabled,
              ]}
              onPress={handleCommentSubmit}
              disabled={!commentText.trim()}
            >
              <Feather name="send" size={16} color="#FFFFFF" />
              <Text style={styles.postButtonText}>Post Comment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.guestBox}>
            <Text style={styles.guestText}>
              <Text style={styles.loginLink} onPress={goLogin}>
                Sign in
              </Text>{" "}
              to comment on this issue.
            </Text>
          </View>
        )}

        {commentSorted.length === 0 ? (
          <Text style={styles.noComments}>
            No comments yet. Be the first to comment!
          </Text>
        ) : (
          <View style={styles.commentsList}>
            {commentSorted.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.author}</Text>
                  <Text style={styles.commentTime}>
                    {formatDate(comment.createdAt)}
                  </Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  backLink: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },

  backLinkText: {
    color: "#2563EB",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },

  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#E5E7EB",
  },

  cardBody: {
    padding: 16,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 12,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  location: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },

  meta: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },

  voteRow: {
    gap: 10,
  },

  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },

  voteButtonActive: {
    backgroundColor: "#2563EB",
  },

  voteButtonText: {
    color: "#374151",
    fontWeight: "600",
  },

  voteButtonTextActive: {
    color: "#FFFFFF",
  },

  voteCount: {
    color: "#374151",
    fontWeight: "700",
  },

  loginHint: {
    fontSize: 13,
    color: "#6B7280",
  },

  loginLink: {
    color: "#2563EB",
    fontWeight: "600",
  },

  commentsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  commentForm: {
    marginBottom: 16,
  },

  textArea: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F9FAFB",
    textAlignVertical: "top",
    marginBottom: 10,
  },

  postButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
  },

  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  guestBox: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },

  guestText: {
    color: "#374151",
    fontSize: 13,
  },

  noComments: {
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 24,
  },

  commentsList: {
    gap: 12,
  },

  commentItem: {
    backgroundColor: "#F9FAFB",
    borderLeftWidth: 4,
    borderLeftColor: "#BFDBFE",
    borderRadius: 10,
    padding: 12,
  },

  commentHeader: {
    marginBottom: 6,
  },

  commentAuthor: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },

  commentTime: {
    fontSize: 12,
    color: "#6B7280",
  },

  commentText: {
    color: "#374151",
    lineHeight: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F3F4F6",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptyText: {
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  backButtonText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
