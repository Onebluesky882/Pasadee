import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Box, Pressable, SafeAreaView } from "@gluestack-ui/themed";
import { TeacherSVG } from "../components/lottie";
const conversation = () => {
  // video synclabs.so
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box className="flex-1">
        <Box className="flex-1 bg-red-200">
          <TeacherSVG />

          <Box className="flex items-center p-2">
            <Pressable
              onPress={() => {
                console.log("mic pressed");
              }}
              style={({ pressed }) => [
                {
                  borderRadius: 9999,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#000",
                  backgroundColor: pressed ? "#3b82f6" : "transparent", // blue-500 on press
                },
              ]}
            >
              {({ pressed }) => (
                <FontAwesome
                  name="microphone"
                  size={24}
                  color={pressed ? "white" : "black"}
                  className={`${
                    pressed && "border-white"
                  } border  rounded-full p-3`}
                />
              )}
            </Pressable>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
};
export default conversation;
