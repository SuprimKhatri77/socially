"use server";

import { APIError } from "better-auth/api";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import { eq } from "drizzle-orm";
import { user } from "../../lib/db/schema";

interface State {
  errorMessage?: string | null;
}

export async function SignIn(prevState: State, formData: FormData) {
  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("pwd") as string,
    firstName: formData.get("firstname") as string,
    lastName: formData.get("lastname") as string,
  };

  const { email, password, firstName, lastName } = rawFormData;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "User already exists." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid email." };
        default:
          return { errorMessage: "Something went wrong." };
      }
    }
  }
  redirect("/feed");
}

export async function SignUp(prevState: State, formData: FormData) {
  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("pwd") as string,
    firstName: formData.get("firstname") as string,
    lastName: formData.get("lastname") as string,
  };

  const { email, password, firstName, lastName } = rawFormData;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: `${firstName} ${lastName}`,
        email,
        password,
      },
    });

    if (result) {
      await db.insert(user).values({
        name: `${firstName} ${lastName}`,
        email,
        id: result.user.id,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { errorMessage: "User already exists." };
        case "BAD_REQUEST":
          return { errorMessage: "Invalid email." };
        default:
          return { errorMessage: "Something went wrong." };
      }
    }
  }
  redirect(`/sign-up/verify-email?email=${encodeURIComponent(email)}`);
}

export async function searchAccount(email: string) {
  const queryUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return !!queryUser;
}
