import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../lib/db";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email";
import * as schema from "../../lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 1,
    maxPasswordLength: 77,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your Password",
        text: `
        <p>You requested a password reset.</p>
        <p>Click the link to reset your password: ${url}</p>

        <p>If you didn't request this, you can safely ignore this email.</p>

        `,
      });
    },
    resetPasswordTokenExpiresIn: 7200,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click on the link to verify your email: ${url}`,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [nextCookies()],
});
