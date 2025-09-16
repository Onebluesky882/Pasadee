To-Do Flow — English Tutor App (Expo ↔ NestJS ↔ Groq)

1. Frontend (Expo) — Recording & Streaming

ตั้งค่า expo-av สำหรับอัดเสียงไมค์

กำหนด format (16kHz mono, wav/m4a)

แบ่งเสียงเป็น chunks 1–2 วินาที

ต่อกับ WebSocket (socket.io-client) ไปยัง NestJS

ส่ง event:

start (แจ้งเริ่ม session)

audio-chunk (ส่งเสียงทีละ chunk, base64/buffer)

end (พูดจบ)

2. Backend (NestJS) — Audio Gateway

สร้าง WebSocket Gateway (@nestjs/websockets)

เก็บ session ของผู้ใช้ (Map: sessionId → audio buffers)

รับ event:

start → สร้าง session buffer

audio-chunk → เก็บ chunk ใน buffer

end → รวม buffer แล้วส่งต่อ Groq Whisper

3. Backend → Groq Whisper (STT)

เรียก Groq Whisper API (/v1/audio/transcriptions)

ส่งไฟล์เสียงรวม (หรือทีละ chunk ถ้าอยาก real streaming)

ได้ผลลัพธ์เป็น ข้อความภาษาอังกฤษ

4. Backend → Groq GPT (Chat model)

ส่งข้อความไป Groq GPT (gpt-oss-20b)

กำหนด prompt เช่น:

"คุณคือครูสอนภาษาอังกฤษ ให้แก้ไขและแนะนำสิ่งที่นักเรียนพูด"

รับข้อความตอบกลับ (คำอธิบาย/แก้ไข/คำแนะนำ)

5. Backend → Groq TTS (PlayAI)

ส่งข้อความคำตอบไป Groq TTS API (/v1/audio/speech)

ตั้งค่า voice (เช่น alloy, sofia, verse)

ใช้ streaming response → อ่านทีละ chunk

ส่ง chunk กลับไปยัง frontend ผ่าน WebSocket event:

tts-chunk (chunk base64/buffer)

tts-end (ส่งจบ)

6. Frontend (Expo) — Play Audio Response

รับ event tts-chunk → เก็บไว้เป็นไฟล์ชั่วคราว (base64 → file)

เมื่อไฟล์พอใหญ่ → ใช้ expo-av เล่นเสียงออกลำโพง

เมื่อได้ tts-end → รวมไฟล์ที่เหลือ → เล่นจนจบ

แสดงข้อความ (จาก Whisper + GPT) บน UI

7. Extras (Optional แต่ควรมี)

VAD (Voice Activity Detection): ตัดสินว่าผู้ใช้พูดจบเมื่อไร

JWT Auth → ให้ socket ต่อกับ backend ต้อง auth ก่อน

Rate limit / Queue → ป้องกัน spam API

Error handling → ส่ง error event ถ้า Groq API ล้มเหลว

Analytics → เก็บ log latency (พูด → text → GPT → ตอบกลับ)

🔄 Flow สุดท้าย (Summary)

📱 Expo → อัดเสียง chunk → ส่งไป NestJS ผ่าน WebSocket

🖥️ NestJS → เก็บ chunk → ส่งไป Groq Whisper (STT)

🧠 Whisper → ได้ข้อความ → ส่งไป Groq GPT → ได้คำตอบ

🗣️ ส่งคำตอบไป Groq TTS (PlayAI) → ได้เสียง (stream)

🔊 NestJS → ส่งเสียง stream กลับ Expo

📱 Expo → เล่นเสียงออกลำโพง + แสดงข้อความ
