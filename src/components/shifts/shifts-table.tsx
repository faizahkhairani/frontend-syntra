import { Button } from "../ui/button"
import { Plus, Search, Loader2 } from "lucide-react"
import { Input } from "../ui/input"
import { useState } from "react"
import { getColumn } from "./table/column"
import { DataTable } from "./table/table"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"


import { useShifts } from "@/hooks/useShifts"
import type { Shift } from "@/types"
import api from "@/lib/axios"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

const formSchema = z.object({
  name:           z.string().min(1, "Nama shift wajib diisi"),
  start_time:     z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format harus HH:mm"),
  end_time:       z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format harus HH:mm"),
  late_tolerance: z.number().min(0, "Minimal 0 menit").max(60, "Maksimal 60 menit"),
})

type FormValues = z.infer<typeof formSchema>

const ShiftsTable = () => {
    const {shifts, fetchShifts, isLoading, deleteShift  } = useShifts()
    const [search, setSearch] = useState("")
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const isEditMode = !!selectedShift

    const { 
        register,
        handleSubmit,
        reset,    
      formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            start_time: "",
            end_time: "",
            late_tolerance: 15,
        },
    })


    const handleAdd = () => {
        reset({ name: "", start_time: "", end_time: "", late_tolerance: 15 })
        setSelectedShift(null)
        setIsFormOpen(true)
    }

    const handleEdit = (shift: Shift) => {
    reset({
        name:           shift.name,
        start_time:     shift.start_time,
        end_time:       shift.end_time,
        late_tolerance: shift.late_tolerance,
    })
    setSelectedShift(shift)
    setIsFormOpen(true)
    }

    const handleDelete = (shift: Shift) => {
        setSelectedShift(shift)
        setIsDeleteOpen(true)
    }

    const filtered = shifts.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleConfirmDelete = async () => {
    if (!selectedShift) return
    try {
      setIsDeleting(true)
      await deleteShift(selectedShift._id)
      toast.success(`${selectedShift.name} berhasil dihapus`)
      setIsDeleteOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const onSubmit = async (data: FormValues) => {
    console.log("Form Data:", data)
    try {
      if (isEditMode) {
        await api.put(`/shifts/${selectedShift._id}`, data)
        toast.success("Shift berhasil diupdate")
      } else {
        await api.post("/shifts", data)
        toast.success("Shift berhasil ditambahkan")
      }
      setIsFormOpen(false)
      fetchShifts()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan")
    }
  }
    

 const columns = getColumn({onEdit: handleEdit, onDelete: handleDelete})
    
  return (
    <div className="space-y-4">
        {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button size="sm" className="h-9 gap-1.5" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          New Shift
        </Button>
      </div>

      {/* Table */}
        <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="border-b pb-2">
                    <DialogTitle className="text-center text-xl font-semibold tracking-[-0.16px] sm:text-left dark:text-[#fcfdffef]">
                          {isEditMode ? "Edit Shift" : "Create Shift"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm leading-tight">
                        Organize and manage Shift, resources, and team collaboration
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
                                                Nama Shift
                                            </FieldLabel>
                                            <Input
                                            className="h-10" 
                                            id="name"
                                            placeholder="Enter Shift name"
                                            {...register("name")}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name.message}</p>
                                            )}
                                        </Field>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel htmlFor="start_time">Jam Mulai</FieldLabel>
                                                <Input
                                                type="time"
                                                className="h-10"
                                                id="start_time"
                                                placeholder="Masukkan Jam Mulai"
                                                {...register("start_time")}
                                                />
                                                {errors.start_time && (
                                                <p className="text-sm text-red-500">{errors.start_time.message}</p>
                                                )}
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="end_time">Jam Akhir</FieldLabel>
                                                <Input
                                                type="time"
                                                className="h-10"
                                                id="end_time"
                                                placeholder="Masukkan Jam Akhir"
                                                {...register("end_time")}
                                                />
                                                {errors.end_time && (
                                                <p className="text-sm text-red-500">{errors.end_time.message}</p>
                                            )}
                                            </Field>
                                        </div>
                                        <Field>
                                            <FieldLabel htmlFor="late_tolerance">Tolerasi Telat (menit)</FieldLabel>
                                            <Input
                                            type="number"
                                            className="h-10"
                                            id="late_tolerance"
                                            placeholder="Masukkan Jam Akhir"
                                            {...register("late_tolerance")}
                                            />
                                            {errors.late_tolerance && (
                                            <p className="text-sm text-red-500">{errors.late_tolerance.message}</p>
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
                                    isEditMode ? "Update Shift" : "Create Shift"
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
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Hapus Staff</DialogTitle>
                <DialogDescription>
                Yakin ingin menghapus{" "}
                <span className="font-semibold text-foreground">{selectedShift?.name}</span>?
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
    </div>
  )
}

export default ShiftsTable