import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
import { authClient } from "./auth-client";
export const createSocket = async (): Promise<Socket> => {
  const token = await AsyncStorage.getItem("jwt");
  authClient.getCookie;
  console.log("token :", token);
  const socket: Socket = io("http://192.168.1.38.3009", {
    transports: ["websocket"],
    auth: {
      token: token,
    },
  });
  return socket;
};
