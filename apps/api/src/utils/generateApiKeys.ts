import crypto from "node:crypto";


export function generateApiKeys()
{
  const prefixRandom = crypto.randomBytes(3).toString("hex")
  const secretRandom = crypto.randomBytes(24).toString("hex")
  const prefix = `ak_live_${prefixRandom}`
  const secret = secretRandom
  const fullKey = `${prefix}.${secret}`

  return {
    fullKey,
    prefix,
    secret
  }
}