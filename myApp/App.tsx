import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Header from "./components/ui/Header";
import HomePage from "./screens/Home";
import Profile from "./screens/Profile";
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: true,
            headerTitle: () => <Header />,
          }}
        >
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen
            name="profile"
            component={Profile}
            options={{ title: "profile" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
