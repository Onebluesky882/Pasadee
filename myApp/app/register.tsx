import { Input, InputField } from "@/components/ui/input";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";

export default function Register() {
  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      console.log("success :", data);
    } catch (error) {
      console.error(" signup failed:", error);
    }

    // router.push("/login"); // กลับไปหน้า login หลังสมัคร
  };

  const SubmitForm = async () => {};
  return (
    <Box className="flex-1 justify-center items-center bg-gray-50 px-5">
      <Text className="text-2xl font-bold mb-6">Sign Up</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField
              placeholder="username"
              value={value}
              onChange={onChange}
              type="text"
            />
          </Input>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField
              placeholder="email"
              value={value}
              onChange={onChange}
              type="text"
            />
          </Input>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField
              placeholder="password"
              type="password"
              value={value}
              onChange={onChange}
            />
          </Input>
        )}
      />

      <Button onPress={handleSubmit(onSubmit)} className="w-full bg-green-500">
        <Text className="text-white text-center">Sign Up</Text>
      </Button>

      <Text
        className="mt-4 text-blue-500"
        onPress={() => router.push("/login")}
      >
        Already have an account? Login
      </Text>
    </Box>
  );
}
