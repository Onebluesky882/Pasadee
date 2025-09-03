import { authClient } from "@/lib/auth-client";
import { router } from "expo-router/build/imperative-api";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleSignup = async () => {
    await authClient.signUp.email({
      email,
      password,
      name,
    });

    const session = await authClient.getSession();
    if (session) {
      router.push("/(tabs)");
    }
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
}
