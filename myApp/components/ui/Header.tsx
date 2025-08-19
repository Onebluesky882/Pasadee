import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text } from "react-native";
import { Box } from "./box";
import { Pressable } from "./pressable";

export default function Header() {
  const [active, setActive] = useState("home");
  const menuItems = [
    { name: "home" },
    { name: "user" },
    { name: "search1" },
  ] as const;

  const navigation = useNavigation<any>();
  return (
    <Box className="flex-row   justify-between items-center  w-full ">
      {/*     <Box className="flex-row items-center justify-between w-full px-4 py-3 border-b border-gray-200 bg-white"> */}
      <Box>
        <Text>Logo</Text>
      </Box>
      <Box className={`flex-row gap-10 items-center justify-center    `}>
        {menuItems.map(item => (
          <Pressable key={item.name} onPress={() => setActive(item.name)}>
            <AntDesign
              onPress={() => navigation.navigate("greeting")}
              name={item.name}
              size={24}
              color={active === item.name ? "blue" : "black"}
            />
          </Pressable>
        ))}
      </Box>
    </Box>
  );
}
