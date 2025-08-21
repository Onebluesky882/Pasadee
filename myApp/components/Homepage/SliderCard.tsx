import { Box, Image } from "@gluestack-ui/themed";
import { Dimensions, ImageSourcePropType } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";
type ImageItem = {
  id: number;
  image: ImageSourcePropType;
};

type Props = {
  data: ImageItem[];
};

const SliderCard = ({ data }: Props) => {
  const height = 300;
  const width = Dimensions.get("screen").width;
  return (
    <Box className="  w-full ">
      <Carousel
        width={width}
        loop={true}
        height={258}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlay={true}
        autoPlayInterval={5000}
        data={data as any}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item }: CarouselRenderItemInfo<{ image: string }>) => (
          <Box className="rounded-lg overflow-hidden">
            <Image
              source={item.image}
              resizeMode="cover"
              alt="slider"
              width={width}
              height={258}
            />
          </Box>
        )}
      />
    </Box>
  );
};

export default SliderCard;
