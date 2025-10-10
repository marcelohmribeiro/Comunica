import { z } from "zod";

const envSchema = z.object({
  WEB_CLIENT_ID: z.string(),
  IOS_CLIENT_ID: z.string(),
  FB_API_KEY: z.string(),
  FB_AUTH_DOMAIN: z.string(),
  FB_PROJECT_ID: z.string(),
  FB_STORAGE_BUCKET: z.string(),
  CD_NAME: z.string(),
  CD_UPLOAD_PRESET: z.string(),
});

const env = envSchema.parse({
  WEB_CLIENT_ID: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  IOS_CLIENT_ID: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  FB_API_KEY: process.env.EXPO_PUBLIC_FB_API_KEY,
  FB_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN,
  FB_PROJECT_ID: process.env.EXPO_PUBLIC_FB_PROJECT_ID,
  FB_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FB_STORAGE_BUCKET,
  CD_NAME: process.env.EXPO_PUBLIC_CD_NAME,
  CD_UPLOAD_PRESET: process.env.EXPO_PUBLIC_CD_UPLOAD_PRESET,
});

export const settings = {
  ...env,
};
