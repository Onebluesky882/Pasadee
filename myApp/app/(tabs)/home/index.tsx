import PressableDirect from "@/components/Homepage/PressableDirect";
import SliderCard from "@/components/Homepage/SliderCard";
import { HStack } from "@/components/ui/hstack";
import { Box, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import React from "react";
const imagesSlider = [
  { id: 1, image: require("@/assets/images/1.png") },
  { id: 2, image: require("@/assets/images/2.png") },
  { id: 3, image: require("@/assets/images/3.png") },
];
export default function Home() {
  const router = useRouter();
  return (
    <Box className="flex justify-center">
      <SliderCard data={imagesSlider} />
      {/*  section 2*/}

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
            onPress={() => router.push("/(tabs)/screen/vocabulary")}
            bg={"pink"}
          />
          <PressableDirect
            pathName={"Read and Write"}
            bg={"blue"}
            onPress={() => router.push("/(tabs)/screen/read-write")}
          />
        </HStack>

        {/* Section 3 - 3 items */}
        <HStack space="md" className="mt-2">
          <PressableDirect
            bg={"green"}
            pathName={"Conversation 1:1"}
            onPress={() => router.push("/(tabs)/screen/vocabulary")}
          />
          <PressableDirect
            bg={"purple"}
            pathName={"Q & A Test"}
            onPress={() => router.push("/(tabs)/screen/vocabulary")}
          />
          <PressableDirect
            bg={"yellow"}
            pathName={" Lesson English"}
            onPress={() => router.push("/(tabs)/screen/vocabulary")}
          />
        </HStack>
      </Box>
    </Box>
  );
}
