import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email('Invalid email.'),
    RESEND_AUDIENCE_ID: z.string().min(1),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT: z.string().url(),
    NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: z
      .string()
      .min(1, { message: 'Required' }),
    NEXT_PUBLIC_MODE: z.string().min(1, { message: 'Required' }),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT:
      process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT,
    NEXT_PUBLIC_HASHNODE_PUBLICATION_ID:
      process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID,
    NEXT_PUBLIC_MODE: process.env.NEXT_PUBLIC_MODE,
  },
})
