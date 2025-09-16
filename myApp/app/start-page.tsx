import { Button, ButtonText } from "@/components/ui/button";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

const index = () => {
  return (
    <>
      <View
        className="flex justify-center items-center h-full"
        style={style.container}
      >
        <Text style={style.title}>Pasadee</Text>
        <View>
          <Image
            source={require("../assets/images/cover.png")}
            resizeMode="cover"
          />
        </View>
        <View className="p-5">
          <Text className="text-3xl">Hi, How are you today!</Text>
        </View>

        <Link href={"/(tabs)"} asChild>
          <Button variant="solid" size="md" action="primary">
            <ButtonText>get started</ButtonText>
          </Button>
        </Link>
      </View>
    </>
  );
};
export default index;

const style = StyleSheet.create({
  container: {
    backgroundColor: "#fffcf5",
  },

  title: {
    marginBottom: 20,
    fontFamily: "InterBold",
    fontSize: 38,
    color: "#443C34",
  },
});
