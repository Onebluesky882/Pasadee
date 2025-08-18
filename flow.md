สถาปัตยกรรม MVP
[Expo App] <-- WebSocket --> [NestJS Backend] <---> [OpenAI Realtime API]
│
capture audio / play feedback
│
└──> send audio chunks → backend → OpenAI
│
└──> receive text/audio feedback → play / display

Frontend (Expo):

จับเสียงผู้เรียน

ส่ง audio chunks ไป backend

เล่นเสียงตอบกลับ

แสดงข้อความ feedback

Backend (NestJS):

Relay audio/text → OpenAI Realtime API

เก็บข้อความที่แปลงแล้วลง PostgreSQL (text + timestamp + user_id)

Database:

ตาราง users → จัดการผู้เรียน

ตาราง sessions → เก็บข้อความแปลงจาก speech และ feedback

2️⃣ Step-by-Step การทำ MVP
Step 1: ตั้งค่า Backend (NestJS + PostgreSQL)

สร้างโปรเจกต์ NestJS

nest new backend

ติดตั้ง dependencies

npm install @nestjs/websockets @nestjs/platform-socket.io typeorm pg @nestjs/jwt bcrypt

สร้าง UserModule และ SessionModule

User: id, name, email, password hash

Session: id, user_id, audio_text, feedback_text, timestamp

สร้าง WebSocket Gateway สำหรับ streaming audio/text

Step 2: เชื่อม Backend → OpenAI Realtime API

ใช้ GPT-5 nano สำหรับ MVP (เร็วและประหยัด)

Relay audio chunks จาก frontend → OpenAI

รับ speech-to-text และ text feedback

Step 3: Frontend (Expo)

ติดตั้ง dependencies

expo install expo-av
npm install socket.io-client

จับเสียงจากไมโครโฟน (chunked audio)

ส่ง audio chunks → backend ผ่าน WebSocket

เล่นเสียงตอบกลับแบบ streaming

Step 4: เก็บข้อความลง DB

Backend รับข้อความจาก OpenAI (text) → insert ลง sessions

Structure ตัวอย่าง:

@Entity()
export class Session {
@PrimaryGeneratedColumn()
id: number;

@Column()
userId: number;

@Column('text')
audioText: string;

@Column('text', { nullable: true })
feedbackText: string;

@CreateDateColumn()
createdAt: Date;
}

Step 5: MVP Flow สรุป

1. ผู้เรียนพูด
2. Expo App capture audio → send to NestJS WebSocket
3. NestJS relay → OpenAI Realtime API (GPT-5 nano)
4. OpenAI → speech-to-text + feedback
5. NestJS save audioText + feedbackText → PostgreSQL
6. NestJS relay → Expo App
7. Expo App เล่นเสียง + แสดงข้อความ feedback

Step 6: Next Step หลัง MVP

เพิ่ม mini model สำหรับ feedback ละเอียด

ทำ progress dashboard: วิเคราะห์ session, grammar, vocabulary

เพิ่ม auth / JWT เพื่อเก็บข้อมูลผู้เรียนแต่ละคน
