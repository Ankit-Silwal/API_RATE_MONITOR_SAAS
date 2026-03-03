"use client"

import { useAuth, UserButton } from "@clerk/nextjs"
import { useEffect } from "react"

export default function Dashboard()
{
  const { getToken, isLoaded, userId } = useAuth()

  useEffect(() =>
  {
    if (!isLoaded || !userId)
    {
      return
    }

    async function sync()
    {
      const token = await getToken()

      console.log("TOKEN:", token)

      await fetch("http://localhost:8000/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    sync()
  }, [isLoaded, userId, getToken])

  return (
    <div>
      <h1>Dashboard</h1>
      <UserButton />
    </div>
  )
}