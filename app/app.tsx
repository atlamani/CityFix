import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaView, StatusBar } from "react-native";

import HomeScreen from "@/components/Home";
import LoginScreen from "@/components/login";
import SignUpScreen from "@/components/SignUpScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  SignUp: undefined;
  // ReportIssue: undefined;
  // IssueDetail: { id: string };
  // Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView
        style={{ flex: 1, paddingTop: StatusBar.currentHeight || 0 }}
      >
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
