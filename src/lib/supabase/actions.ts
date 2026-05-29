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
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `${firstName} ${lastName}`.trim() },
    },
  })

  if (error) return { error: error.message }

  // Auto-login after sign-up. Requires "Confirm email" to be OFF in Supabase Dashboard.
  // If it's ON, signInWithPassword returns "Email not confirmed" → show helpful message.
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
  if (loginError) return { error: "Konto erstellt. Bitte bestätige deine E-Mail, dann kannst du dich anmelden." }

  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
