import { z } from "zod";

const envSchema = z.object({
  WEB_CLIENT_ID: z.string(),
  IOS_CLIENT_ID: z.string(),
  API_URL: z.string().url(),
});

const env = envSchema.parse({
  WEB_CLIENT_ID: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  IOS_CLIENT_ID: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  API_URL: process.env.EXPO_PUBLIC_API_URL,
});

export const settings = {
  ...env,
};
