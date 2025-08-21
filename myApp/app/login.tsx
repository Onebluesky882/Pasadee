import { Input, InputField } from "@/components/ui/input";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";

export default function Login() {
  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Login data:", data);
    // redirect หลัง login
    router.push("/home");
  };

  return (
    <Box className="flex-1 justify-center items-center bg-gray-50 px-5">
      <Text className="text-2xl font-bold mb-6">Login</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField
              placeholder="Email"
              value={value}
              onChangeText={onChange}
            />
          </Input>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField placeholder="Full Name" />
          </Input>
        )}
      />

      <Button onPress={handleSubmit(onSubmit)} className="w-full bg-blue-500">
        <Text className="text-white text-center">Login</Text>
      </Button>

      <Text
        className="mt-4 text-blue-500"
        onPress={() => router.push("/register")}
      >
        Don't have an account? Sign Up
      </Text>
    </Box>
  );
}
