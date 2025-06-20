class ApiService {
  getAuthHeaders() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")
      return {
        "Content-Type": "application/json",
        ...(token && { "x-access-token": token }),
      }
    }
    return {
      "Content-Type": "application/json",
    }
  }

  async login(data) {
    try {
      // Use internal API route to avoid CORS
      const loginPayload = {
        email: data.email || "",
        username: data.username || "",
        password: data.password,
      }

      console.log("Login attempt:", { ...loginPayload, password: "***" })

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      })

      console.log("Login response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("Login error data:", errorData)
        throw new Error(errorData.error || "Login failed")
      }

      const result = await response.json()
      console.log("Login success:", result)

      // Store access token
      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token)
        console.log("Access token stored")
      }

      return result
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async register(data) {
    try {
      const registerPayload = {
        email: data.email,
        username: data.username,
        password: data.password,
      }

      console.log("Register attempt:", { ...registerPayload, password: "***" })

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerPayload),
      })

      console.log("Register response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("Register error data:", errorData)
        throw new Error(errorData.error || "Registration failed")
      }

      const result = await response.json()
      console.log("Register success:", result)

      // Store access token if provided
      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token)
        console.log("Access token stored after registration")
      }

      return result
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }

  async getProfile() {
    try {
      const headers = this.getAuthHeaders()
      console.log("Get profile attempt with token:", headers["x-access-token"] ? "***" : "not set")

      const response = await fetch("/api/getProfile", {
        method: "GET",
        headers: headers,
      })

      console.log("Get profile response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("Get profile error data:", errorData)
        throw new Error(errorData.error || "Failed to fetch profile")
      }

      const result = await response.json()
      console.log("Get profile success:", result)
      return result
    } catch (error) {
      console.error("Get profile error:", error)
      throw error
    }
  }

  async createProfile(data) {
    try {
      const profilePayload = {
        name: data.name || "",
        birthday: data.birthday || "",
        height: Number(data.height) || 0,
        weight: Number(data.weight) || 0,
        interests: Array.isArray(data.interests) ? data.interests : [],
        gender: data.gender || "",
        profileImage: data.profileImage || "",
        heightUnit: data.heightUnit || "cm",
        heightFeet: Number(data.heightFeet) || 0,
        heightInches: Number(data.heightInches) || 0,
      }

      const headers = this.getAuthHeaders()
      console.log("Create profile attempt:", {
        ...profilePayload,
        profileImage: profilePayload.profileImage ? "***" : "",
      })

      const response = await fetch("/api/createProfile", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(profilePayload),
      })

      console.log("Create profile response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("Create profile error data:", errorData)
        throw new Error(errorData.error || "Failed to create profile")
      }

      const result = await response.json()
      console.log("Create profile success:", result)
      return result
    } catch (error) {
      console.error("Create profile error:", error)
      throw error
    }
  }

  async updateProfile(data) {
    try {
      const profilePayload = {
        name: data.name || "",
        birthday: data.birthday || "",
        height: Number(data.height) || 0,
        weight: Number(data.weight) || 0,
        interests: Array.isArray(data.interests) ? data.interests : [],
        gender: data.gender || "",
        profileImage: data.profileImage || "",
        heightUnit: data.heightUnit || "cm",
        heightFeet: Number(data.heightFeet) || 0,
        heightInches: Number(data.heightInches) || 0,
      }

      const headers = this.getAuthHeaders()
      console.log("Update profile attempt:", {
        ...profilePayload,
        profileImage: profilePayload.profileImage ? "***" : "",
      })

      const response = await fetch("/api/updateProfile", {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(profilePayload),
      })

      console.log("Update profile response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("Update profile error data:", errorData)
        throw new Error(errorData.error || "Failed to update profile")
      }

      const result = await response.json()
      console.log("Update profile success:", result)
      return result
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }
}

export const apiService = new ApiService()
