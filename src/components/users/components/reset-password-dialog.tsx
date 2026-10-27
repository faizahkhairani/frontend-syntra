import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import api from "@/lib/axios"
import type { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import PasswordInput from "../../password-input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { resetPasswordSchema, type ResetPasswordValues } from "../schemas"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function ResetPasswordDialog({ open, onOpenChange, user }: Props) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) reset()
  }

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!user) return
    try {
      await api.patch(`/users/${user._id}/reset-password`, { newPassword: data.newPassword })
      toast.success(`Password ${user.name} berhasil direset`)
      handleOpenChange(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal reset password")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Masukkan password baru untuk {user?.name}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            <Field>
              <FieldLabel htmlFor="newPassword">Password Baru</FieldLabel>
              <PasswordInput id="newPassword" placeholder="Masukkan password baru" {...register("newPassword")} />
              {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Konfirmasi Password</FieldLabel>
              <PasswordInput id="confirmPassword" placeholder="Ulangi password baru" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>Reset</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}