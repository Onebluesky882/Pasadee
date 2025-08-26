import { Box, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import React from "react";

import PressableDirect from "@/components/Homepage/PressableDirect";
import SliderCard from "@/components/Homepage/SliderCard";
import { HStack } from "@/components/ui/hstack";
import { authClient } from "@/lib/auth-client";

const imagesSlider = [
  { id: 1, image: require("@/assets/images/1.png") },
  { id: 2, image: require("@/assets/images/2.png") },
  { id: 3, image: require("@/assets/images/3.png") },
];
export default function Home() {
  const { data: session } = authClient.useSession();
  console.log("session", session);
  const router = useRouter();
  return (
    <Box className="flex justify-center">
      <SliderCard data={imagesSlider} />
      {session && <Text>Welcome, {session?.user.name}</Text>}
      {/*  section 3 box*/}
      <Box className="mx-4 my-4 space-y-4  ">
        {/* Section 1 */}
        <Box className="border border-gray-300 rounded-lg p-4 shadow bg-white items-center justify-center">
          <Text className="text-lg font-bold">Program</Text>
        </Box>

        {/* Section 2 - 2 items */}
        <HStack space="md" className="mt-2 justify-center">
          <PressableDirect
            pathName={"Vocabulary Game"}
            bg={"yellow"}
            onPress={() => router.push("/(tabs)/screen/vocabulary")}
          />
          <PressableDirect
            pathName={"Read and Write"}
            bg={"blue"}
            onPress={() => router.push("/(tabs)/screen/read-write")}
          />
        </HStack>

        <HStack space="md" className="mt-2">
          <PressableDirect
            bg={"green"}
            pathName={"Conversation 1:1"}
            onPress={() => router.push("/(tabs)/screen/conversation")}
          />
          <PressableDirect
            bg={"purple"}
            pathName={"Q & A Test"}
            onPress={() => router.push("/(tabs)/screen/question-answer")}
          />
          <PressableDirect
            bg={"yellow"}
            pathName={"English lesson"}
            onPress={() => router.push("/(tabs)/screen/english-lesson")}
          />
        </HStack>
      </Box>
    </Box>
  );
}
