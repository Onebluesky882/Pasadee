import axios from "axios";

if (!process.env.EXPO_PUBLIC_OPENAI_KEY) {
  console.error("no process.env.EXPO_PUBLIC_OPENAI_KEY");
}

console.log("process : ", process.env.EXPO_PUBLIC_OPENAI_KEY);
export const apiInstance = async () => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/responses",
      {
        model: "gpt-5-nano",
        input: "write a haiku about AI",
        store: true,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
        },
      }
    );

    console.log("OpenAI Response:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("API error:");
  }
};
