import { io, Socket } from "socket.io-client";
export const createSocket = async (): Promise<Socket> => {
  // const token = await AsyncStorage.getItem("jwt");
  // authClient.getCookie;
  // console.log("token :", token);
  const socket: Socket = io("http://192.168.1.38.3009", {
    transports: ["websocket"],
  });
  socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
  socket.on("disconnect", () => console.log("⚠️ Socket disconnected"));
  socket.on("connect_error", err => console.error("❌ Connect error:", err));

  return socket;
};
