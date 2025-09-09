import { io } from "socket.io-client";

const socket = io("http://localhost:3000/webrtc");

async function initCall(stream: MediaStream) {
  const pc = new RTCPeerConnection();

  // เพิ่ม local tracks
  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  pc.onicecandidate = event => {
    if (event.candidate) {
      socket.emit("ice-candidate", event.candidate);
    }
  };

  // create offer
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  // ส่ง offer ไป NestJS Gateway
  socket.emit("offer", offer);

  // รอ SDP answer
  socket.on("answer", async answer => {
    await pc.setRemoteDescription(answer);
  });
}
