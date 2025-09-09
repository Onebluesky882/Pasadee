import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as wrtc from 'wrtc';

@WebSocketGateway()
export class WrtcGateway {
  @WebSocketServer()
  server: Server;

  private peers: Map<string, wrtc.RTCPeerConnection> = new Map();

  @SubscribeMessage('offer')
  async handleOffer(
    @MessageBody() offer: any,
    @ConnectedSocket() client: Socket,
  ) {
    // 1. สร้าง PeerConnection สำหรับ client
    const peer = new wrtc.RTCPeerConnection();

    // 2. รับ track จาก client
    peer.ontrack = (event: any) => {
      console.log('Received track from client', event.streams[0].id);
      // TODO: ส่ง stream ไป Speech-to-Text service
    };

    // 3. รับ SDP offer จาก frontend
    await peer.setRemoteDescription(new wrtc.RTCSessionDescription(offer));

    // 4. สร้าง SDP answer
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    // 5. เก็บ peer ใน map
    this.peers.set(client.id, peer);

    // 6. ส่ง answer กลับ client
    client.emit('answer', peer.localDescription);
  }

  @SubscribeMessage('ice-candidate')
  async handleIceCandidate(
    @MessageBody() candidate: any,
    @ConnectedSocket() client: Socket,
  ) {
    const peer = this.peers.get(client.id);
    if (peer) {
      await peer.addIceCandidate(candidate);
    }
  }

  handleDisconnect(client: Socket) {
    const peer = this.peers.get(client.id);
    if (peer) {
      peer.close();
      this.peers.delete(client.id);
    }
    console.log(`Client disconnected: ${client.id}`);
  }
}
