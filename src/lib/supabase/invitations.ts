import { createAdminClient } from "./admin"

export type TokenValidation =
  | { valid: true;  invitationId: string; sponsorId: string }
  | { valid: false; reason: string }

export async function validateToken(token: string): Promise<TokenValidation> {
  if (!token?.trim()) {
    return { valid: false, reason: "Kein Einladungstoken angegeben." }
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("invitations")
    .select("id, created_by, is_active, expires_at")
    .eq("token", token)
    .single()

  if (error || !data) {
    return { valid: false, reason: "Diese Einladung ist nicht mehr gültig." }
  }
  if (!data.is_active) {
    return { valid: false, reason: "Diese Einladung wurde deaktiviert." }
  }
  if (new Date(data.expires_at) < new Date()) {
    return { valid: false, reason: "Diese Einladung ist abgelaufen." }
  }

  return { valid: true, invitationId: data.id, sponsorId: data.created_by }
}

// Tracks that someone used this invitation — increments counter but does NOT
// mark it as consumed, so the link stays valid for future registrants.
export async function recordInvitationUse(token: string): Promise<void> {
  const admin = createAdminClient()
  await admin.rpc("increment_invitation_use_count", { p_token: token })
}

export async function setSponsor(userId: string, sponsorId: string): Promise<void> {
  const admin = createAdminClient()
  const { error } = await admin
    .from("profiles")
    .update({ sponsor_id: sponsorId })
    .eq("id", userId)
  if (error) {
    console.error("[setSponsor] failed for user", userId, "—", error.message)
  }
}

export async function setConsent(userId: string): Promise<void> {
  const admin = createAdminClient()
  const now   = new Date().toISOString()
  await admin
    .from("profiles")
    .update({ privacy_accepted_at: now, terms_accepted_at: now })
    .eq("id", userId)
}
