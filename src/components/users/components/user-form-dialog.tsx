import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useIsDemo } from "@/hooks/useDemo"
import type { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field"
import { userFormSchema, type UserFormValues } from "../schemas"

const emptyValues: UserFormValues = {
  name: "", email: "", password: "", phone: "",
  department: "", gender: "Male", role: "employee",
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null          // null = mode tambah
  onSuccess: () => void
}

export function UserFormDialog({ open, onOpenChange, user, onSuccess }: Props) {
  const isEditMode = !!user
  const isDemo = useIsDemo()

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: emptyValues,
  })

  // isi ulang form tiap dialog dibuka
  useEffect(() => {
    if (!open) return
    reset(
      user
        ? {
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            department: user.department ?? "",
            gender: user.gender,
            role: user.role,
          }
        : emptyValues
    )
  }, [open, user, reset])

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (user) {
        const { password, ...rest } = data
        await api.put(`/users/${user._id}`, rest)
        toast.success("Data staff berhasil diupdate")
      } else {
        await api.post("/users", data)
        toast.success("Staff berhasil ditambahkan")
      }
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Akun Staff" : "Menambahkan Staff Baru"}
          </DialogTitle>
          <DialogDescription>
            Menyusun dan mengelola staff, sumber daya, serta kolaborasi tim
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                  <Input id="name" className="h-10" placeholder="Masukkan nama lengkap" {...register("name")} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" type="email" className="h-10" placeholder="Masukkan email" {...register("email")} />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </Field>

                {!isEditMode && (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" className="h-10" placeholder="Masukkan password" {...register("password")} />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </Field>
                )}

                <Field>
                  <FieldLabel htmlFor="phone">Nomor Telepon</FieldLabel>
                  <Input id="phone" type="tel" className="h-10" placeholder="Masukkan nomor telepon" {...register("phone")} />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="department">Departemen</FieldLabel>
                  <Input id="department" className="h-10" placeholder="e.g. Grooming / HR" {...register("department")} />
                  {errors.department && <p className="text-sm text-red-500">{errors.department.message}</p>}
                </Field>

                <Field>
                  <FieldLabel>Jenis Kelamin</FieldLabel>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Laki-laki</SelectItem>
                          <SelectItem value="Female">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                </Field>

                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Karyawan</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <Field className="flex justify-end gap-2" orientation="responsive">
              <Button type="submit" disabled={isSubmitting || isDemo}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>
                ) : isEditMode ? "Update User" : "Create User"}
              </Button>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}