import { Button } from "../ui/button"
import { Plus, Search, Loader2, CalendarIcon } from "lucide-react"
import { Input } from "../ui/input"
import { useState, useEffect } from "react"
import { getColumn } from "./table/column"
import { DataTable } from "./table/table"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"

import { format } from "date-fns"
import api from "@/lib/axios"
import { Controller } from "react-hook-form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import type { ShiftSchedule } from "@/types"
import { useUsers } from "@/hooks/useUsers"
import { useShifts } from "@/hooks/useShifts"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "../ui/input-group"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Calendar } from "../ui/calendar"

const formSchema = z.object({
  userId:   z.string().min(1, "Staff wajib dipilih"),
  shiftId:  z.string().min(1, "Shift wajib dipilih"),
  date:     z.string().min(1, "Tanggal wajib diisi"), 
})

type FormValues = z.infer<typeof formSchema>


const SchedulesTable = () => {
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0] // ← default hari ini
  )
  // const {userSchedules, isLoading, fetchUserSchedules, deleteUserSchedules} = useUsersSchedules()
  const [userSchedules, setUserSchedules] = useState<ShiftSchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSchedules = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filterDate) params.append("date", filterDate)
      const res = await api.get(`/shift-schedules?${params.toString()}`)
      setUserSchedules(res.data.data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengambil data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [filterDate])

  const {users} = useUsers()
  const {shifts} = useShifts()

  const [search, setSearch] = useState("")
  const [selectedSchedule, setSelectedSchedule] = useState<ShiftSchedule | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
    const { 
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors, isSubmitting }
    } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        userId: "", shiftId: "", date: ""
      }
    })

  const handleAdd = () => {
    reset({ userId: "", shiftId: "", date: "" })
    setIsFormOpen(true)
  }

  const handleDelete = (schedule: ShiftSchedule) => {
    setSelectedSchedule(schedule)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedSchedule) return
    try {
      setIsDeleting(true)
      await api.delete(`/shift-schedules/${selectedSchedule._id}`)

      toast.success("Jadwal berhasil dihapus")

      setUserSchedules((prev) =>
        prev.filter((s) => s._id !== selectedSchedule._id)
      )
      setIsDeleteOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      await api.post("/shift-schedules", data)
      toast.success("Jadwal berhasil ditambahkan")
      setIsFormOpen(false)
      fetchSchedules()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan")
    }
  }


  const filtered = userSchedules.filter((u) =>
    u.userId.name.toLowerCase().includes(search.toLowerCase())
  )

  const columns = getColumn({onDelete: handleDelete})
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="h-9 w-40"
        />
        </div>


        {/* Reset ke hari ini */}
          {filterDate !== new Date().toISOString().split("T")[0] && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-xs text-muted-foreground"
              onClick={() => setFilterDate(new Date().toISOString().split("T")[0])}
            >
              Hari ini
            </Button>
          )}

        <Button size="sm" className="h-9 gap-1.5" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Assign Shift
        </Button>
      </div>

      {/* Table */}
      <DataTable
      columns={columns}
      data={filtered}
      isLoading={isLoading}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="border-b pb-3">
            <DialogTitle>Assign Shift</DialogTitle>
            <DialogDescription>
              Tentukan jadwal shift untuk karyawan
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="userId">
                      Pilih Staff
                    </FieldLabel>
                    <Controller
                    control={control}
                    name="userId"
                    render={({field}) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Staff" />
                        </SelectTrigger>

                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem
                              key={user._id}
                              value={user._id}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    />
                    {errors.userId && (
                      <p className="text-sm text-red-500">{errors.userId.message}</p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="userId">
                      Pilih Shift
                    </FieldLabel>
                    <Controller
                    control={control}
                    name="shiftId"
                    render={({field}) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a Shift" />
                        </SelectTrigger>

                        <SelectContent>
                          {shifts.map((shift) => (
                            <SelectItem
                              key={shift._id}
                              value={shift._id}
                            >
                              {shift.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    />
                    {errors.shiftId && (
                      <p className="text-sm text-red-500">{errors.shiftId.message}</p>
                    )}
                  </Field>
                  {/* <Field>
                    <FieldLabel htmlFor="date">Tanggal</FieldLabel>
                    <Input 
                    className="h-10"
                    id="date"
                    type="date"
                    {...register("date")}
                    />
                    {errors.date && (
                      <p className="text-sm text-red-500">{errors.date.message}</p>
                    )}
                  </Field> */}
                  <Controller
                  control={control}
                  name="date"
                  render={({ field }) => {
                    // nangkep value dari tanggal yg dipilih
                    const selectedDate = field.value
                      ? new Date(field.value)
                      : undefined

                    return (
                      <Field>
                        <FieldLabel>Tanggal</FieldLabel>

                        <InputGroup>
                          <InputGroupInput
                            value={field.value || ""}
                            placeholder="Select date"
                            readOnly
                          />

                          <InputGroupAddon align="inline-end">
                            <Popover>
                              <PopoverTrigger asChild>
                                <InputGroupButton
                                  variant="ghost"
                                  size="icon-xs"
                                  aria-label="Select date"
                                >
                                  <CalendarIcon />
                                </InputGroupButton>
                              </PopoverTrigger>

                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="end"
                              >
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  captionLayout="dropdown"
                                  // pilih tanggal
                                  onSelect={(date) => {
                                    if (date) {
                                      field.onChange(format(date, "yyyy-MM-dd"))
                                    }
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </InputGroupAddon>
                        </InputGroup>

                        {errors.date && (
                          <p className="text-sm text-red-500">
                            {errors.date.message}
                          </p>
                        )}
                      </Field>
                    )
                  }}
                />
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <Field className="flex justify-end gap-2" orientation="responsive">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</>
                  ) : "Assign"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Jadwal</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Yakin ingin menghapus jadwal{" "}
            <span className="font-semibold text-foreground">
              {selectedSchedule?.userId.name}
            </span>{" "}
            pada tanggal{" "}
            <span className="font-semibold text-foreground">
              {selectedSchedule?.date}
            </span>?
            Jadwal yang sudah ada absensinya tidak bisa dihapus.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menghapus...</>
              ) : "Hapus"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default SchedulesTable