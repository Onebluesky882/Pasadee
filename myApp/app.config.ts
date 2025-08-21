import { ConfigContext, ExpoConfig } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "MyApp",
    slug: "my-app",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
      API_KEY: process.env.API_KEY,
    },
  };
};
