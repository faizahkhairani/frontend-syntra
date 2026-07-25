import { useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import api from "@/lib/axios"
import { useAuthStore } from "@/store/authStore"

export const useLogin = () => {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const res = await api.post("/auth/login", { email, password })
      const token = res.data.token
      const user = res.data.data
      setAuth(user, token)
      toast.success(`Selamat datang, ${user.name}!`)
      if (user.role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/beranda")
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login gagal")
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading }
}