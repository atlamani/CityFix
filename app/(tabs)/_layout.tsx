import { Tabs } from "expo-router/tabs";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="signup" options={{ title: "SignUp" }} />
    </Tabs>
  );
}
