import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.headers.get("x-access-token")

    if (!accessToken) {
      return NextResponse.json({ error: "Access token required" }, { status: 401 })
    }

    console.log("Proxy get profile request with token:", accessToken ? "***" : "not provided")

    const response = await fetch(`${API_BASE_URL}/api/getProfile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": accessToken,
      },
    })

    console.log("API response status:", response.status)

    const data = await response.json()
    console.log("API response data:", data)

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Failed to get profile" }, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Get profile proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
