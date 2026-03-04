import bcrypt from "bcrypt"

export async function hashApiKey(key:string){
  const saltRounds=10;
  return bcrypt.hash(key,saltRounds)
}