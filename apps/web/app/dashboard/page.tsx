"use client"

import { useAuth, UserButton } from "@clerk/nextjs"
import { useEffect } from "react"

export default function Dashboard()
{
  const { getToken } = useAuth()

  useEffect(() =>
  {
    async function sync()
    {
      const token = await getToken()

      await fetch("http://localhost:8000/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }

    sync()
  }, [getToken])

  return (
    <div>
      <h1>Dashboard</h1>
      <UserButton />
    </div>
  )
}