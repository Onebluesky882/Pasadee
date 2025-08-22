import { ConfigContext, ExpoConfig } from "expo/config";
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "myApp",
  slug: "myApp",
  scheme: "myapp",
  platforms: ["ios", "android", "web"],
  version: "1.0.0",
  extra: {
    apiUrl: "http://192.168.1.49:3001",
  },
});
