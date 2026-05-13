import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import UsersForm from "./create-users-form";

const UsersCreate = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => {
    setIsOpen(false)
  }
  const onSuccess = () => {
    setIsOpen(false) // tutup modal setelah sukses
  }
  return (
    <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          New Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <UsersForm onClose={onClose} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  )
}

export default UsersCreate