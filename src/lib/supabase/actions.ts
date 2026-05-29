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

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `${firstName} ${lastName}`.trim() },
    },
  })

  if (signUpError) return { error: signUpError.message }

  // Session is present when "Confirm email" is OFF — no second signIn needed
  if (!signUpData.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) return { error: "Konto erstellt. Bitte bestätige deine E-Mail und melde dich dann an." }
  }

  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
