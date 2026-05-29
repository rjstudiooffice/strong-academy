"use server"

import { createClient } from "./server"
import { redirect } from "next/navigation"

export type AuthState = { error: string } | null

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email    = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect("/")
}

export async function register(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = formData.get("firstName") as string
  const lastName  = formData.get("lastName") as string
  const email     = formData.get("email") as string
  const password  = formData.get("password") as string

  const supabase = await createClient()

  // ── Step 1: signUp ──────────────────────────────────────────────────────────
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `${firstName} ${lastName}`.trim() },
    },
  })

  if (signUpError) {
    console.error("[register/signUp]", {
      message: signUpError.message,
      status:  signUpError.status,
      name:    signUpError.name,
      code:    (signUpError as { code?: string }).code ?? "–",
    })
    return {
      error: `[signUp] ${signUpError.message} · status ${signUpError.status ?? "–"}`,
    }
  }

  console.log("[register/signUp] ok — user id:", signUpData.user?.id ?? "none", "· session:", signUpData.session ? "present" : "null")

  // ── Step 2: signIn ──────────────────────────────────────────────────────────
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

  if (signInError) {
    console.error("[register/signIn]", {
      message: signInError.message,
      status:  signInError.status,
      name:    signInError.name,
      code:    (signInError as { code?: string }).code ?? "–",
    })
    return {
      error: `[signIn] ${signInError.message} · status ${signInError.status ?? "–"}`,
    }
  }

  console.log("[register/signIn] ok — session expires:", signInData.session?.expires_at ?? "–")

  // ── Step 3: redirect ────────────────────────────────────────────────────────
  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
