import { HeaderLeft, HeaderRight } from "@/components/tabsLayout";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Button } from "react-native";
const _layout = () => {
  const router = useRouter();

  const GoBack = () => {
    return <Button onPress={() => router.back()} title={"back"} />;
  };

  const TabBarIcon = (props: { name: any; color: string; size?: number }) => {
    return <FontAwesome {...props} name={props.name} size={props.size || 28} />;
  };

  return (
    <Tabs
      screenOptions={{
        headerRight: () => <HeaderRight />,
        headerLeft: () => <HeaderLeft />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name={"home"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="voice/index"
        options={{
          title: "Voice",
          headerLeft: () => <GoBack />,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="microphone" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification/index"
        options={{
          title: "Notification",
          headerLeft: () => <GoBack />,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="notifications-circle-sharp"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Dashboard",
          headerLeft: () => <GoBack />,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="ranking-star" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          headerLeft: () => <GoBack />,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="crown" size={24} color={color} />
          ),
        }}
      />

      {/*   hidden */}
      <Tabs.Screen
        name="screen"
        options={{
          href: null,
          headerShadowVisible: false,
        }}
      />
    </Tabs>
  );
};
export default _layout;
