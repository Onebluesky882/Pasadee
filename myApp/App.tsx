import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Header from "./components/ui/Header";
import Greeting from "./screens/Greeting";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: () => <Header />,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{ title: "profile" }}
      />
    </Tab.Navigator>
  );
};
export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="greeting" component={Greeting} />
          <Stack.Screen name="main" component={Tabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
