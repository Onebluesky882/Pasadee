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
    <Box className="  w-full">
      <Box className="  overflow-hidden">
        <Carousel
          width={width}
          loop={true}
          height={258}
          snapEnabled={true}
          autoPlay={true}
          pagingEnabled={true}
          autoPlayInterval={5000}
          data={data as any}
          renderItem={({ item }: CarouselRenderItemInfo<{ image: string }>) => (
            <Image
              source={item.image}
              resizeMode="contain"
              alt="slider"
              width={width}
              height={height}
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default SliderCard;
