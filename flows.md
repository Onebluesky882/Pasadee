🎤 Student speaks
|
v
[Expo Frontend] ---stream---> [NestJS Backend]
mic audio receive chunks
|
v
[Speech-to-Text]
|
text transcript
|
v
[AI Model Agent]
("reasoning/chat")
|
v
[Text-to-Speech TTS]
|
v
[Expo Frontend] <---stream--- [NestJS Backend]
play audio
🎧 Student listens

Flow ที่ได้

Frontend (Expo) → อัดเสียง & ส่ง Base64 → Backend (NestJS)

Backend ส่งไป Groq Whisper → แปลงเป็นข้อความ

ส่งข้อความไป Groq GPT OSS-20B → ได้คำตอบ

ส่งคำตอบไป Groq TTS (PlayAI) → ได้เสียง Base64

ส่งกลับ Frontend → เล่นออกลำโพง 🎧
