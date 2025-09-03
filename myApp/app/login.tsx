import { authClient } from "@/lib/auth-client";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, TextInput, View } from "react-native";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session } = await authClient.getSession();
      if (session) {
        authClient;
        router.push("/(tabs)");
        if (session) router.push("/(tabs)");
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    const { data: session, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) {
      console.log("error login", error);
    }
    if (session) {
      router.push("/(tabs)");
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="register" onPress={() => router.push("/register")} />
    </View>
  );
}
