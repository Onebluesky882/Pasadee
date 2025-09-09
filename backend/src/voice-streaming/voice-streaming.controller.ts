import { Body, Controller, Post } from '@nestjs/common';
import * as wrtc from 'wrtc';
@Controller('voice-streaming')
export class VoiceStreamingController {
  private peer: wrtc.RTCPeerConnection;

  @Post('offer')
  async offer(@Body() offer: any) {
    this.peer = new wrtc.RTCPeerConnection();
    this.peer.ontrack = (event: any) => {
      console.log('received track from client', event.stream[0].id);
      // TODO: คุณสามารถส่ง stream นี้ไป Speech-to-Text service ได้
    };
    await this.peer.setRemoteDescription(new wrtc.RTCSessionDescription(offer));

    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);

    return this.peer.localDescription;
  }
}
