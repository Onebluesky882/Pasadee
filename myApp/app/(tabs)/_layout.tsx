import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import { Button } from "react-native";
import { HeaderLeft, HeaderRight } from "../../components/tabsLayout";

const _layout = () => {
  const router = useRouter();

  const GoBack = () => {
    return <Button onPress={() => router.back()} title={"back"} />;
  };

  const TabBarIcon = (props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
    size?: number;
  }) => {
    return <FontAwesome {...props} name={props.name} size={props.size || 28} />;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerRight: () => <HeaderRight />,
        headerLeft: () => <HeaderLeft />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Pasadee",

          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"home"} color={color} size={0} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerLeft: () => <GoBack />,
          tabBarIcon: ({ color }) => <TabBarIcon name={"user"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerLeft: () => <GoBack />,
          tabBarIcon: ({ color }) => <TabBarIcon name={"user"} color={color} />,
        }}
      />

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
