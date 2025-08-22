import { Button, ButtonText } from "@gluestack-ui/themed";
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
const index = () => {
  const [redirect, setRedirect] = useState(true);
  return (
    <>
      {redirect ? (
        <Redirect href="/conversation" />
      ) : (
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
            <Button style={style.button}>
              <ButtonText>get started</ButtonText>
            </Button>
          </Link>
        </View>
      )}
    </>
  );
};
export default index;

const style = StyleSheet.create({
  container: {
    backgroundColor: "#fffcf5",
  },
  button: {
    backgroundColor: "#D4BA76",
    borderRadius: 20,
    marginTop: 10,
  },

  title: {
    marginBottom: 20,
    fontFamily: "InterBold",
    fontSize: 38,
    color: "#443C34",
  },
});
