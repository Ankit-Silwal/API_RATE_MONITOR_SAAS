import crypto from "node:crypto";

export function generateApiKeys():string{
  const random=crypto.randomBytes(24).toString("hex");
  return `ak_live_${random}`
}