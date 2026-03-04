import bcrypt from "bcrypt"

export async function hashApiKey(secret: string)
{
  const saltRounds = 10
  return bcrypt.hash(secret, saltRounds)
}