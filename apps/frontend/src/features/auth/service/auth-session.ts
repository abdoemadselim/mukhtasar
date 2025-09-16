import { cookies } from "next/headers"

export async function getSession() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("adaa-session")?.value

  if (!token) return null

  try {
    const res = await fetch(`${process.env.API_URL}/auth/me`, {
      headers: { Cookie: `adaa-session=${token}` },
      cache: "no-store", // always fresh session
    })


    if (!res.ok) {
      console.warn(`getSession: backend responded with ${res.status}`)
      return null
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("getSession: failed to fetch or parse session", error)
    return null
  }
}