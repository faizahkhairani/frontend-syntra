import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTable } from "./table/table"
import { getColumn } from "./table/column"
import { useUsers } from "@/hooks/useUsers"
import type { User } from "@/types"
import { toast } from "sonner"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import api from "@/lib/axios"


// useUsers.ts fetch data → array users
//         ↓
// DataTable terima data={filtered} — array users dipass ke tabel
//         ↓
// Tanstack Table buat row per item
// setiap row punya row.original = data user di baris itu
//         ↓
// DataTableRowActions terima row sebagai props
//         ↓
// const user = row.original ← ini data user di baris yang diklik
//         ↓
// onEdit(user) / onDelete(user) dipanggil dengan data user itu

// validasi field 
const formSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  phone: z.string().min(1, "No. HP wajib diisi"),
  department: z.string().min(1, "Department wajib diisi"),
  gender: z.enum(["Male", "Female"], { message: "Gender wajib dipilih", }),
  role: z.enum(["employee", "admin"]),
})

type FormValues = z.infer<typeof formSchema>

const UsersTable = () => {
  const { users, isLoading, deleteUser, fetchUsers } = useUsers()
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)

  // selectedUser nya null berarti false
  // selectedUser nya ada objek user berati true
  const isEditMode = !!selectedUser // convert ke boolean

  const {
    register,
    handleSubmit,
    control,  
    reset,    
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", email: "", password: "",
      phone: "", department: "", role: "employee", gender: "Male",
    }, 
    })

    const resetSchema = z.object({
      newPassword: z.string().min(6, "Password minimal 6 karakter"),
      confirmPassword: z.string().min(6, "Konfirmasi password wajib diisi"),
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: "Password tidak sama",
      path: ["confirmPassword"],
    })

    type ResetFormValues = z.infer<typeof resetSchema>

    const resetForm = useForm<ResetFormValues>({
      resolver: zodResolver(resetSchema),
      defaultValues: { newPassword: "", confirmPassword: "" },
    })

    const handleConfirmReset = async (data: ResetFormValues) => {
      console.log("kepanggil")
      if (!selectedUser) return
      try {
        await api.patch(`/users/${selectedUser._id}/reset-password`, {
          newPassword: data.newPassword,
        })
        toast.success(`Password ${selectedUser.name} berhasil direset`)
        setIsResetOpen(false)
        resetForm.reset()
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Gagal reset password")
      }
    }

  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setIsResetOpen(true)
  }

    // nambah data
    const handleAdd = () => {
      reset({
        name: "", email: "", password: "",
        phone: "", department: "",
        gender: "Male", role: "employee",
      })
      setSelectedUser(null)
      setIsFormOpen(true)
    }

    // edit data
    const handleEdit = (user: User) => {
      console.log(user)
      reset({
        name:       user.name,
        email:      user.email,
        phone:      user.phone ?? "",
        department: user.department ?? "",
        gender:     user.gender,
        role:       user.role,
      })
      setSelectedUser(user)
      setIsFormOpen(true)
    }

  // hapus data
  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return
    try {
      setIsDeleting(true)
      await deleteUser(selectedUser._id)
      toast.success(`${selectedUser.name} berhasil dihapus`)
      setIsDeleteOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  // const handleResetPassword = async () => {
  //   alert("Klik reset password!")
  // }

  // const onSubmit = async (data: FormValues) => {
  //   console.log(data)
  //   try {
  //     await api.post("/users", data)
  //     toast.success("Staff berhasil ditambahkan")
  //     setIsFormOpen(false)
  //     fetchUsers() // refresh tabel
  //   } catch (err: any) {
  //       toast.error(err.response?.data?.message || "Gagal menambahkan staff")
  //   }
  // }

  const onSubmit = async (data: FormValues) => {
    console.log(data)
    try {
      if (isEditMode) {
        const {password, ...rest} = data
        await api.put(`/users/${selectedUser._id}`, rest)
        toast.success("Data staff berhasil diupdate")
      } else {
        await api.post("/users", data)
        toast.success("Staff berhasil ditambahkan")
      }
      setIsFormOpen(false)
      fetchUsers()
    } catch (err: any) {
       toast.error(err.response?.data?.message || "Terjadi kesalahan")
    }
  }

  // filter search di frontend
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const columns = getColumn({
    onEdit: handleEdit, 
    onDelete: handleDelete, 
    onResetPassword: handleResetPassword})

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button size="sm" className="h-9 gap-1.5" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          New Staff
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
      />

      {/* Dialog Menambah Data */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="text-center text-xl font-semibold tracking-[-0.16px] sm:text-left dark:text-[#fcfdffef]">
              {isEditMode ? "Edit Staff Account" : "Create Staff Account"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-tight">
              Organize and manage staff, resources, and team collaboration
            </DialogDescription>
          </DialogHeader>
          <div className="h-auto w-full max-w-full">
            <div className="h-full">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">
                                    Full Name
                                </FieldLabel>
                                <Input 
                                className="h-10" 
                                id="name" 
                                placeholder="Enter full name" 
                                {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">
                                    Email
                                </FieldLabel>
                                <Input
                                    className="h-10"
                                    id="email"
                                    type="email"
                                    placeholder="Enter email"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </Field>
                            {!isEditMode && (
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    className="h-10"
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </Field>
                            )}
                            <Field>
                                <FieldLabel htmlFor="phone">
                                    Phone
                                </FieldLabel>
                                <Input
                                    className="h-10"
                                    id="phone"
                                    type="number"
                                    placeholder="Enter phone number"
                                    {...register("phone")}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="department">Department</FieldLabel>
                                <Input
                                    className="h-10"
                                    id="department"
                                    placeholder="e.g. Grooming / HR"
                                    {...register("department")}
                                />
                                {errors.department && (
                                    <p className="text-sm text-red-500">{errors.department.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel>Gender</FieldLabel>
                                <Controller 
                                control={control} 
                                name="gender"
                                render={({field}) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                />
                                {errors.gender && (
                                    <p className="text-sm text-red-500">{errors.gender.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel>Role</FieldLabel>
                                <Controller
                                    control={control}
                                    name="role"
                                    render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="employee">Employee</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    )}
                                />
                                {errors.role && (
                                    <p className="text-sm text-red-500">{errors.role.message}</p>
                                )}
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator/>
                    <Field className="flex justify-end gap-2" orientation="responsive">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                            ) : (
                            isEditMode ? "Update User" : "Create User"
                            )}
                        </Button>
                        <Button variant="outline" type="button" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
        {/* Dialog Hapus Data Staff */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Staff</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus{" "}
              <span className="font-semibold text-foreground">{selectedUser?.name}</span>?
              Semua data terkait akan ikut terhapus dan tidak bisa dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}
            disabled={isDeleting}>
              {isDeleting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menghapus...</>
              ) : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Reset Password */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Masukkan password baru untuk {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={resetForm.handleSubmit(handleConfirmReset)}>
            <div className="space-y-4 py-2">
              <Field>
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  {...resetForm.register("newPassword")}
                />             
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  {...resetForm.register("confirmPassword")}
                />
              </Field>
            </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetOpen(false)}>Batal</Button>
            <Button type="submit" disabled={resetForm.formState.isSubmitting}>
              {resetForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : "Reset Password"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UsersTable