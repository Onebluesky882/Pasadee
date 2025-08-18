import { Text } from "react-native";
import { Box } from "../components/ui/box";
const Greeting = () => {
  return (
    <Box className="flex-1 items-center justify-center bg-yellow-400">
      <Text className="text-red-400 text-xl font-bold">greeting</Text>
    </Box>
  );
};
export default Greeting;
