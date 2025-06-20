import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Proxy register request:", { ...body, password: "***" })

    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("API response status:", response.status)

    const data = await response.json()
    console.log("API response data:", data)

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Registration failed" }, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Register proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
