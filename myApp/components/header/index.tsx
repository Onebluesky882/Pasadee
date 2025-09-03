import Feather from "@expo/vector-icons/Feather";
import { Box, Pressable, Text } from "@gluestack-ui/themed";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { authClient } from "../../lib/auth-client";

export const HeaderRight = () => {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  console.log("userName :", session);
  return (
    <Box className="    p-2 ">
      {session ? (
        <Text>{session.user.name}</Text>
      ) : (
        <Pressable onPress={() => router.push("/login")}>
          <Feather name="user" size={24} color="black" />
        </Pressable>
      )}
    </Box>
  );
};

export const HeaderLeft = () => {
  return (
    <Box className="    p-2  ">
      <Pressable>
        <Ionicons name="menu" size={24} color="black" />
      </Pressable>
    </Box>
  );
};
