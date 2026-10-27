import z from "zod"

export const userFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  phone: z.string().min(1, "No. HP wajib diisi"),
  department: z.string().min(1, "Department wajib diisi"),
  gender: z.enum(["Male", "Female"], { message: "Gender wajib dipilih" }),
  role: z.enum(["employee", "admin"]),
})

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password wajib diisi"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })

export type UserFormValues = z.infer<typeof userFormSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>