import { useState, useEffect } from "react"
import api from "@/lib/axios"
import type { User } from "@/types"

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<String | null>(null)

    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/users")
            setUsers(res.data.data)
        } catch (error: any) {
            setError(error.response?.data?.message || "Gagal mengambil data")
        } finally {
            setIsLoading(false)
        }
    }

    const deleteUser = async (id: string) => {
        try {
            await api.delete(`/users/${id}`)
            setUsers((prev) => prev.filter((u) => u._id !== id))
        } catch (err: any) {
            throw new Error(err.response?.data?.message || "Gagal menghapus staff")
        }
    }

    useEffect(() => {
      fetchUsers()
    }, [])
    
    return {users, isLoading, error, fetchUsers, deleteUser}
}