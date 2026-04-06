import IssueDetailScreen from "@/components/IssueDetailScreen";
import { useLocalSearchParams } from "expo-router";

export default function IssueDetailPage() {
  const { id } = useLocalSearchParams();

  // Create a route object that matches what NativeStackScreenProps expects
  const route = {
    params: { id: Array.isArray(id) ? id[0] : id },
  };

  return (
    <IssueDetailScreen route={route as any} navigation={undefined as any} />
  );
}
