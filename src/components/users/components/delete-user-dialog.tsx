import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { User } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: (id: string) => Promise<void>
}

export function DeleteUserDialog({ open, onOpenChange, user, onConfirm }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    if (!user) return
    try {
      setIsDeleting(true)
      await onConfirm(user._id)
      toast.success(`${user.name} berhasil dihapus`)
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Staff</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus{" "}
            <span className="font-semibold text-foreground">{user?.name}</span>?
            Semua data terkait akan ikut terhapus dan tidak bisa dikembalikan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menghapus...</> : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}