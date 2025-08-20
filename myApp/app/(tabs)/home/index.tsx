import { Box } from "@gluestack-ui/themed";
import React from "react";
import SliderCard from "../../../components/Homepage/SliderCard";
const imagesSlider = [
  { id: 1, image: require("@/assets/images/1.png") },
  { id: 2, image: require("@/assets/images/2.png") },
  { id: 3, image: require("@/assets/images/3.png") },
];
export default function Home() {
  return (
    <Box>
      <SliderCard data={imagesSlider} />
    </Box>
  );
}
