import { Slot } from "expo-router";
import { View } from "../../../components/Themed";
const _layout = () => {
  return (
    <View>
      <Slot />
    </View>
  );
};
export default _layout;
