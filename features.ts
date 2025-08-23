// Centralized feature flags with safe defaults. Values are read from validated env.
import { serverEnv } from "./config/env"

export const features = {
  useAppServices: serverEnv.flags.useAppServices && !serverEnv.flags.disableNewStack,
  useApiPosts: serverEnv.flags.useApiPosts && !serverEnv.flags.disableNewStack,
  hardenCron: serverEnv.flags.hardenCron,
  disableNewStack: serverEnv.flags.disableNewStack,
  autoClassifyPosts: process.env.NEXT_PUBLIC_AUTO_CLASSIFY_POSTS === "true" && !serverEnv.flags.disableNewStack,
}


