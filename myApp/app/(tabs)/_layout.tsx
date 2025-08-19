import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import { Button } from "react-native";

const _layout = () => {
  const router = useRouter();

  const GoBack = () => {
    return <Button onPress={() => router.back()} title={"back"} />;
  };

  const TabBarIcon = (props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
  }) => {
    return <FontAwesome {...props} name={props.name} size={28} />;
  };

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="home"
        options={{
          headerLeft: () => <GoBack />,

          tabBarIcon: ({ color }) => <TabBarIcon name={"home"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerLeft: () => <GoBack />,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"meetup"} color={color} />
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
    </Tabs>
  );
};
export default _layout;
