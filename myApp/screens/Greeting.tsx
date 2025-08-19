import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text } from "react-native";
import { Box } from "../components/ui/box";
import { Button, ButtonText } from "../components/ui/button";

const style = StyleSheet.create({
  bg: {
    backgroundColor: "#fffcf5",
  },
});
const Greeting = () => {
  const navigation = useNavigation<any>();
  return (
    <Box
      style={style.bg}
      className="flex-1  items-center justify-center p-4 border h-full   "
    >
      <Box className="flex items-center justify-center">
        <Text className="text-center text-3xl">Pasadee</Text>
      </Box>
      <Box className="flex   items-center justify-center bg-yellow-400">
        <Image
          source={require("../assets/cover.png")}
          style={{
            maxWidth: 120,
            aspectRatio: 1.5, // adjust to your image (width / height)
          }}
          resizeMode="contain" // contain / cover / stretch / center
        />
      </Box>
      <Box className="flex items-center justify-center">
        <Text className="text-center text-3xl">Hi, How are you today?</Text>
      </Box>

      <Button
        style={{
          marginTop: 40,
          paddingTop: 0,
          backgroundColor: "#E5AD2E",
          borderRadius: 20,
        }}
        onPress={() => navigation.navigate("main")}
      >
        <ButtonText>Get Started</ButtonText>
      </Button>
    </Box>
  );
};
export default Greeting;
