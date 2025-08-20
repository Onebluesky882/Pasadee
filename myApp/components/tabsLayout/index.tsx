import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Box } from "@gluestack-ui/themed";

import React from "react";
export const HeaderRight = () => {
  return (
    <Box className="    p-2  ">
      <Feather name="user" size={24} color="black" />
    </Box>
  );
};

export const HeaderLeft = () => {
  return (
    <Box className="    p-2  ">
      <Ionicons name="menu" size={24} color="black" />
    </Box>
  );
};
