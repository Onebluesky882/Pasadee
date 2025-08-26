import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = await authClient.signUp.email({
      email,
      password,
      name,
    });
    console.log("data", data);
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
      <Button title="Signup" onPress={handleLogin} />
    </View>
  );
}
