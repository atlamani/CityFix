import { RootStackParamList } from "@/App";
import { authStore } from "@/auth-store";
import { issueStore } from "@/store";
import { Issue, IssueCategory, IssueStatus } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { CategoryIcon } from "./CategoryIcon";
import { StatusBadge } from "./StatusBadge";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type FilterValue<T extends string> = T | "all";
type OpenFilter = "category" | "status" | null;

const categoryOptions: {
  label: string;
  value: FilterValue<IssueCategory>;
}[] = [
  { label: "All Categories", value: "all" },
  { label: "Pothole", value: "pothole" },
  { label: "Broken Streetlight", value: "streetlight" },
  { label: "Graffiti", value: "graffiti" },
  { label: "Other Issue", value: "other" },
];

const statusOptions: {
  label: string;
  value: FilterValue<IssueStatus>;
}[] = [
  { label: "All Statuses", value: "all" },
  { label: "Reported", value: "reported" },
  { label: "In Progress", value: "in-progress" },
  { label: "Resolved", value: "resolved" },
];

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString();
}

export default function HomeScreen({ navigation }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const horizontalPadding = width < 420 ? 14 : 20;
  const cardWidth = Math.min(width - horizontalPadding * 2, 960);
  const issuePhotoHeight = Math.round(
    Math.max(220, Math.min(340, width * 0.42)),
  );
  const isCompact = width < 420;

  const [issues, setIssues] = useState<Issue[]>(issueStore.getIssues());
  const [currentUser, setCurrentUser] = useState(authStore.getCurrentUser());
  const [selectedCategory, setSelectedCategory] =
    useState<FilterValue<IssueCategory>>("all");
  const [selectedStatus, setSelectedStatus] =
    useState<FilterValue<IssueStatus>>("all");
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const categoryMatches =
        selectedCategory === "all" || issue.category === selectedCategory;
      const statusMatches =
        selectedStatus === "all" || issue.status === selectedStatus;

      return categoryMatches && statusMatches;
    });
  }, [issues, selectedCategory, selectedStatus]);

  const selectedCategoryLabel =
    categoryOptions.find((option) => option.value === selectedCategory)
      ?.label ?? "All Categories";

  const selectedStatusLabel =
    statusOptions.find((option) => option.value === selectedStatus)?.label ??
    "All Statuses";

  const navigateToIssueDetail = (issueId: string) => {
    if (navigation?.navigate) {
      navigation.navigate("IssueDetail", { id: issueId });
    } else {
      router.push({
        pathname: "/IssueDetail",
        params: { id: issueId },
      });
    }
  };

  const navigateToReportIssue = () => {
    if (navigation?.navigate) {
      navigation.navigate("ReportIssue");
    } else {
      router.push("/ReportIssue");
    }
  };

  useEffect(() => {
    const unsubscribeIssues = issueStore.subscribe(() => {
      setIssues(issueStore.getIssues());
    });

    const unsubscribeAuth = authStore.subscribe(() => {
      setCurrentUser(authStore.getCurrentUser());
    });

    return () => {
      unsubscribeIssues();
      unsubscribeAuth();
    };
  }, []);

  const renderCategoryOption = (option: {
    label: string;
    value: FilterValue<IssueCategory>;
  }) => {
    const isSelected = option.value === selectedCategory;

    return (
      <TouchableOpacity
        key={option.value}
        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
        onPress={() => {
          setSelectedCategory(option.value);
          setOpenFilter(null);
        }}
        activeOpacity={0.85}
      >
        <Text
          style={[
            styles.optionPillText,
            isSelected && styles.optionPillTextSelected,
          ]}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStatusOption = (option: {
    label: string;
    value: FilterValue<IssueStatus>;
  }) => {
    const isSelected = option.value === selectedStatus;

    return (
      <TouchableOpacity
        key={option.value}
        style={[styles.optionPill, isSelected && styles.optionPillSelected]}
        onPress={() => {
          setSelectedStatus(option.value);
          setOpenFilter(null);
        }}
        activeOpacity={0.85}
      >
        <Text
          style={[
            styles.optionPillText,
            isSelected && styles.optionPillTextSelected,
          ]}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDropdown = (type: OpenFilter) => {
    const isCategory = type === "category";
    const options = isCategory ? categoryOptions : statusOptions;
    const selectedLabel = isCategory
      ? selectedCategoryLabel
      : selectedStatusLabel;

    return (
      <View style={styles.dropdownBlock}>
        <TouchableOpacity
          style={styles.dropdownField}
          onPress={() => {
            setOpenFilter(openFilter === type ? null : type);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.dropdownFieldText}>{selectedLabel}</Text>
          <Ionicons
            name={openFilter === type ? "chevron-up" : "chevron-down"}
            size={18}
            color="#6B7280"
          />
        </TouchableOpacity>

        {openFilter === type ? (
          <View style={styles.optionsRow}>
            {isCategory
              ? categoryOptions.map((option) => renderCategoryOption(option))
              : statusOptions.map((option) => renderStatusOption(option))}
          </View>
        ) : null}

        {isCategory ? (
          <Text style={styles.filterHint}>
            Tap to choose a category and narrow the list.
          </Text>
        ) : (
          <Text style={styles.filterHint}>
            Tap to choose a status and narrow the list.
          </Text>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: Issue }) => (
    <TouchableOpacity
      style={[styles.issueCard, { width: cardWidth }]}
      onPress={() => {
        navigateToIssueDetail(item.id);
      }}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.photo }}
        style={[styles.issuePhoto, { height: issuePhotoHeight }]}
      />
      <View style={styles.issueContent}>
        <View style={styles.issueHeaderRow}>
          <CategoryIcon category={item.category} showLabel />
          <StatusBadge status={item.status} />
        </View>

        <Text style={styles.issueDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.issueFooterRow}>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="thumbs-up" size={14} color="#6B7280" />
              <Text style={styles.statText}>{item.votes}</Text>
            </View>

            <View style={styles.statItem}>
              <Feather name="message-circle" size={14} color="#6B7280" />
              <Text style={styles.statText}>{item.comments.length}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredIssues}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={[styles.headerShell, { width: cardWidth }]}>
            <View style={styles.topBar}>
              <View style={styles.brandWrap}>
                <View style={styles.brandIconWrap}>
                  <Ionicons name="warning-outline" size={24} color="#1E63F7" />
                </View>
                <Text style={styles.brandText}>CityFix</Text>
              </View>

              <View style={styles.navRow}>
                <View style={styles.navPill}>
                  <Ionicons name="home-outline" size={14} color="#2563EB" />
                  <Text style={styles.navPillTextInactive}>Home</Text>
                </View>

                <TouchableOpacity
                  style={styles.navPillActive}
                  onPress={navigateToReportIssue}
                  activeOpacity={0.9}
                >
                  <Ionicons name="add-circle-outline" size={14} color="#FFF" />
                  <Text style={styles.navPillTextActive}>Report</Text>
                </TouchableOpacity>

                <View style={styles.userPill}>
                  <Feather name="user" size={14} color="#6B7280" />
                  <Text style={styles.userPillText}>
                    {currentUser?.username || "DemoUser"}
                  </Text>
                </View>

                <View style={styles.logoutButton}>
                  <Feather name="log-out" size={16} color="#6B7280" />
                </View>
              </View>
            </View>

            <Text
              style={[styles.pageTitle, isCompact && styles.pageTitleCompact]}
            >
              Community Issues
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                isCompact && styles.pageSubtitleCompact,
              ]}
            >
              {
                "Browse reported issues in your neighborhood and see what's being addressed"
              }
            </Text>

            <View style={styles.filterCard}>
              <View style={styles.filterHeader}>
                <Feather name="filter" size={18} color="#111827" />
                <Text style={styles.filterTitle}>Filter Issues</Text>
              </View>

              <Text style={styles.filterLabel}>Category</Text>
              {renderDropdown("category")}

              <Text style={styles.filterLabel}>Status</Text>
              {renderDropdown("status")}
            </View>

            <Text style={styles.summaryText}>
              Showing {filteredIssues.length} of {issues.length} issues
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={[styles.emptyState, { width: cardWidth }]}>
            <Text style={styles.emptyText}>
              No issues found matching your filters.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  listContent: {
    paddingTop: 10,
    paddingBottom: 24,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  headerShell: {
    alignSelf: "center",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
    gap: 10,
  },

  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  brandIconWrap: {
    marginRight: 6,
  },

  brandText: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.2,
  },

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
    flexShrink: 1,
  },

  navPill: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#EFF4FF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  navPillActive: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#2463F7",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  navPillTextInactive: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },

  navPillTextActive: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  userPill: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  userPillText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },

  logoutButton: {
    height: 38,
    width: 38,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  pageTitle: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
    marginBottom: 4,
    letterSpacing: -0.4,
  },

  pageTitleCompact: {
    fontSize: 28,
    lineHeight: 32,
  },

  pageSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#64748B",
    marginBottom: 14,
    width: "100%",
  },

  pageSubtitleCompact: {
    fontSize: 15,
    lineHeight: 21,
  },

  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 12,
  },

  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  filterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  filterLabel: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 8,
  },

  dropdownBlock: {
    marginBottom: 10,
  },

  dropdownField: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#D8DDE6",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  dropdownFieldText: {
    fontSize: 15,
    color: "#111827",
    flex: 1,
    paddingRight: 8,
  },

  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 10,
  },

  optionPill: {
    paddingHorizontal: 12,
    minHeight: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D8DDE6",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  optionPillSelected: {
    backgroundColor: "#2463F7",
    borderColor: "#2463F7",
  },

  optionPillText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },

  optionPillTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  filterHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },

  issueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 18,
    alignSelf: "center",
  },

  issuePhoto: {
    width: "100%",
    backgroundColor: "#E5E7EB",
  },

  issueContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },

  issueHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  issueDescription: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },

  locationText: {
    fontSize: 13,
    color: "#6B7280",
  },

  issueFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dateText: {
    fontSize: 13,
    color: "#6B7280",
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  statText: {
    fontSize: 13,
    color: "#6B7280",
  },

  summaryText: {
    textAlign: "center",
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 8,
  },

  emptyState: {
    paddingVertical: 20,
  },

  emptyText: {
    marginTop: 12,
    textAlign: "center",
    color: "#9CA3AF",
  },
});
