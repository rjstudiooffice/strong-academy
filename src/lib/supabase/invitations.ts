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
    .select("id, created_by, used, expires_at")
    .eq("token", token)
    .single()

  if (error || !data) {
    return { valid: false, reason: "Diese Einladung ist nicht mehr gültig." }
  }
  if (data.used) {
    return { valid: false, reason: "Diese Einladung wurde bereits verwendet." }
  }
  if (new Date(data.expires_at) < new Date()) {
    return { valid: false, reason: "Diese Einladung ist abgelaufen." }
  }

  return { valid: true, invitationId: data.id, sponsorId: data.created_by }
}

export async function markInvitationUsed(token: string, usedBy: string): Promise<void> {
  const admin = createAdminClient()
  await admin
    .from("invitations")
    .update({ used: true, used_by: usedBy })
    .eq("token", token)
}

export async function setSponsor(userId: string, sponsorId: string): Promise<void> {
  const admin = createAdminClient()
  await admin
    .from("profiles")
    .update({ sponsor_id: sponsorId })
    .eq("id", userId)
}

export async function setConsent(userId: string): Promise<void> {
  const admin = createAdminClient()
  const now   = new Date().toISOString()
  await admin
    .from("profiles")
    .update({ privacy_accepted_at: now, terms_accepted_at: now })
    .eq("id", userId)
}
