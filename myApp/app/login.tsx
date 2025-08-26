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
        router.push("/(tabs)");
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    const data = await authClient.signIn.email({
      email,
      password,
    });
    console.log("data", data);
  };
  const input = {
    email: email,
    password: password,
  };
  console.log("input", input);
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
