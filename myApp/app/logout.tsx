import { MaterialIcons } from "@expo/vector-icons";
import { Box, Pressable } from "@gluestack-ui/themed";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { authClient } from "../lib/auth-client";

export default function LogoutScreen() {
  const signout = async () => {
    try {
      await authClient.signOut();
      router.push("/(tabs)");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Box style={styles.card}>
        <MaterialIcons name="logout" size={48} color="#ff4d6d" />
        <Text style={styles.title}>Are you sure you want to logout?</Text>
        <Pressable style={styles.button} onPress={signout}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f4f8",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 20,
    textAlign: "center",
    color: "#333",
  },
  button: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
