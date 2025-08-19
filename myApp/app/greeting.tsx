import { Link } from "expo-router";
import { Button, Image, Text, View } from "react-native";
const index = () => {
  return (
    <View className="flex justify-center items-center h-full">
      <Text className="text-3xl">Pasadee</Text>
      <View>
        <Image
          source={require("../assets/images/cover.png")}
          resizeMode="cover"
        />
      </View>
      <Link href={"/(tabs)/home"} asChild>
        <Button title={"get started"} />
      </Link>
    </View>
  );
};
export default index;
