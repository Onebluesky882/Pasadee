import { Box } from "@gluestack-ui/themed";
import { Pressable, Text } from "react-native";

type Props = {
  pathName?: string;
  onPress: () => void;
  bg?: string;
};
const PressableDirect = ({ onPress, pathName, bg }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        className={`flex border border-gray-300 rounded-lg p-4 bg-${bg}-100 items-center justify-center shadow`}
      >
        <Text className="font-semibold text-center text-blue-800">
          {pathName}
        </Text>
      </Box>
    </Pressable>
  );
};
export default PressableDirect;
