// app/lib/auth-client.ts
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

// 1️⃣ สร้าง authClient
export const authClient = createAuthClient({
  baseURL: "http://192.168.1.49:3008/api/auth", // backend LAN IP + path
  plugins: [
    expoClient({
      scheme: "myApp", // ใช้สำหรับ deep link / redirect
      storagePrefix: "myApp", // prefix ใน SecureStore
      storage: SecureStore, // Expo SecureStore
    }),
  ],
});

// 2️⃣ ฟังก์ชันดึง cookie แบบ type-safe
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookies = await authClient.getCookie();
  if (!cookies) return {};
  return { Cookie: cookies };
};

// 3️⃣ ฟังก์ชันช่วย fetch request authenticated
export const fetchAuthenticated = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // รวม headers จาก cookie + headers จาก options
  const headers = {
    ...(await getAuthHeaders()),
    ...((options.headers as Record<string, string>) || {}),
  };

  // ส่ง request
  const response = await fetch(url, { ...options, headers });

  // เช็ค error ของ response
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${text}`);
  }

  // parse JSON
  return response.json() as Promise<T>;
};

// 4️⃣ ตัวอย่างใช้งาน
/*
import { fetchAuthenticated } from "@/lib/auth-client";

const loadProtectedData = async () => {
  try {
    const data = await fetchAuthenticated("http://192.168.1.53:3001/api/secure-endpoint", {
      method: "GET", // GET request ห้ามมี body
    });
    console.log("Protected data:", data);
  } catch (err) {
    console.error(err);
  }
};
*/
