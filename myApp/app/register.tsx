import { Input, InputField } from "@/components/ui/input";
import { Box, Button, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";

export default function Register() {
  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Register data:", data);
    router.push("/login"); // กลับไปหน้า login หลังสมัคร
  };

  return (
    <Box className="flex-1 justify-center items-center bg-gray-50 px-5">
      <Text className="text-2xl font-bold mb-6">Sign Up</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField placeholder="Full Name" />
          </Input>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input>
            <InputField placeholder="Full Name" />
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
