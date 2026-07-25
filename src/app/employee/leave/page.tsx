import { CalendarDays, CalendarIcon, CheckCircle, XCircle, Clock } from "lucide-react"
import { useMyLeaves } from "@/hooks/useMyLeaves"
import { Skeleton } from "@/components/ui/skeleton"
import MobilePagination from "@/components/employee/mobile-pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { Controller } from "react-hook-form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useIsDemo } from "@/hooks/useDemo"

const formSchema = z.object({
    type: z.string().min(1, "Tipe Cuti Wajib Dipilih"),
    startDate: z.string().min(1, "Tanggal awal wajib dipilih"),
    endDate: z.string().optional(),
    reason: z.string().min(1, "Alasan cuti wajib diisi"),
})

type LeaveFormData = z.infer<typeof formSchema>


const MyLeaves = () => {
    const {
        data, 
        isLoading,
        pagination,
        filterStatus,
        filterYear,
        setFilterStatus,
        setFilterYear,
        quota,
        leaveTypes,
        fetchLeaves
    } = useMyLeaves()

    const isDemo = useIsDemo()


    const {
        register,
        handleSubmit,
        control,  
        reset,
        watch,    
        formState: { errors, isSubmitting }
    } = useForm<LeaveFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
    },
    })

    const selectedType = leaveTypes.find((t) => t.value === watch("type"))

    const onSubmit = async (data: LeaveFormData) => {
        console.log(data)
        try {
        await api.post("/leaves", data)
        toast.success("Pengajuan cuti berhasil dikirim")
        fetchLeaves()
        reset()
        } catch (err: any) {
        toast.error(err.response?.data?.message || "Gagal mengajukan cuti")
        }
    }

    const statusConfig = {
        approved: { label: "Disetujui", bg: "bg-emerald-50", text: "text-emerald-600", icon: CheckCircle },
        pending: { label: "Diproses", bg: "bg-amber-50", text: "text-amber-600", icon: Clock },
        rejected:  { label: "Ditolak", bg: "bg-red-50", text: "text-red-600", icon: XCircle },
    }

    const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
    }


  return (
    <div className="-mt-4 -mx-4">
        <div className="bg-liner-to-br bg-primary rounded-b-[2.5rem] px-6 pt-6 pb-6 shadow-xl">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-blue-100 text-sm mb-1">Sisa Cuti Tahunan</p>
                    <p className="text-white text-xl font-bold">{quota?.remaining} Hari</p>
                    </div>
                    <CalendarDays className="w-12 h-12 text-white/80" />
                </div>
            </div>
        </div>
        <div className="px-6 mt-6">
            <Card className="w-full">
                <CardHeader className="text-lg font-medium">Form Pengajuan</CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel className="text-gray-800">Tipe Cuti</FieldLabel>
                                <Controller control={control} 
                                name="type"                         
                                render={({field}) => (
                                    <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Tipe Cuti" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {leaveTypes.map((type) => (
                                                <SelectItem
                                                key={type.label}
                                                value={type.value}
                                                >
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>                                    
                                )}
                                />
                                {errors.type && (
                                    <p className="text-sm text-red-500">{errors.type.message}</p>
                                )}
                            </Field>
                            <div className="grid grid-cols-2">
                            <Field>
                                <Controller
                                control={control}
                                name="startDate"
                                render={({ field }) => {
                                    // nangkep value dari tanggal yg dipilih convert ke date untuk ditampilkan ke calendar
                                    const selectedDate = field.value
                                    ? new Date(field.value)
                                    : undefined

                                    return (
                                    <Field>
                                        <FieldLabel>Tanggal Awal</FieldLabel>
                                        <InputGroup>
                                        <InputGroupInput
                                            value={field.value || ""}
                                            placeholder="yyyy-MM-dd"
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
                                                onSelect={(startDate) => {
                                                    if (startDate) {
                                                    field.onChange(format(startDate, "yyyy-MM-dd"))
                                                    }
                                                }}
                                                />
                                            </PopoverContent>
                                            </Popover>
                                        </InputGroupAddon>
                                        </InputGroup>

                                        {errors.startDate && (
                                        <p className="text-sm text-red-500">
                                            {errors.startDate.message}
                                        </p>
                                        )}
                                    </Field>
                                    )
                                }}
                                />
                                
                            </Field>
                            {selectedType && !selectedType.fixedDuration && (
                                <Field>
                                    <Controller
                                    control={control}
                                    name="endDate"
                                    render={({ field }) => {
                                        // nangkep value dari tanggal yg dipilih convert ke date untuk ditampilkan ke calendar
                                        const selectedDate = field.value
                                        ? new Date(field.value)
                                        : undefined

                                        return (
                                        <Field>
                                            <FieldLabel>Tanggal Akhir</FieldLabel>
                                            <InputGroup>
                                            <InputGroupInput
                                                value={field.value || ""}
                                                placeholder="yyyy-MM-dd"
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
                                                    onSelect={(endDate) => {
                                                        if (endDate) {
                                                        field.onChange(format(endDate, "yyyy-MM-dd"))
                                                        }
                                                    }}
                                                    />
                                                </PopoverContent>
                                                </Popover>
                                            </InputGroupAddon>
                                            </InputGroup>

                                            {errors.endDate && (
                                            <p className="text-sm text-red-500">
                                                {errors.endDate.message}
                                            </p>
                                            )}
                                        </Field>
                                        )
                                    }}
                                    />
                                    
                                </Field>
                            )}
                            </div>
                            {/* Info kalau fixedDuration */}
                            {selectedType?.fixedDuration && (
                                <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
                                Tanggal selesai otomatis dihitung {selectedType.fixedDuration} hari
                                dari tanggal mulai
                                </div>
                            )}

                            <Field>
                                <FieldLabel>Alasan</FieldLabel>
                                <Textarea 
                                id="reason"
                                placeholder="Tulis alasan pengajuan cuti..."
                                {...register("reason")}
                                />
                            </Field>
                            {errors.reason && (
                                <p className="text-sm text-red-500">{errors.reason.message}</p>
                            )}
                        </FieldGroup>
                        <div className="flex">
                        <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting || isDemo}
                        >
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Mengirim...</>
                        ) : "Ajukan Cuti"}
                        </Button>

                        </div>
                    </form>
                </CardContent>
                
            </Card>
            <Card className="w-full mt-7">
                <CardHeader>
                    <div className="flex flex-col gap-2">
                        <CardTitle className="text-base font-medium">Riwayat Pengajuan</CardTitle>
                        {/* <p className="text-sm text-muted-foreground mt-0.5">{filterYear} · {data.length} pengajuan</p> */}
                        <div className="flex justify-between gap-3">
                            <Select onValueChange={(value) => setFilterStatus(value)} defaultValue={filterStatus}>
                                <SelectTrigger className="w-30">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="approved">Disetujui</SelectItem>
                                    <SelectItem value="pending">Diproses</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                           
                            <Select onValueChange={(value) => setFilterYear(value)} defaultValue={filterYear}>
                                <SelectTrigger className="w-30">
                                    <SelectValue placeholder="Filter Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2024, 2025, 2026].map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>                          
                        </div>

                    </div>
                    {/* <div className="flex items-center gap-3">
                    </div> */}
                </CardHeader>
                <CardContent className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-xl" />
                        ))
                    ) : data.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                            Tidak ada data cuti tahun ini
                        </div>
                    ) : (
                        data.map((d) => {
                            // const leave = d._id
                            const status = statusConfig[d.status as keyof typeof statusConfig] 
                            const Icon = status.icon
                            return(
                                <div 
                                key={d._id}
                                className="p-4 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                        <p className="text-gray-900 font-medium">
                                            {leaveTypes.find((t) => t.value === d.type)?.label || d.type}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {formatDate(d.startDate)} - {formatDate(d.endDate)}
                                        </p>
                                        </div>
                                        <div className={`px-3 py-1 ${status.bg} rounded-lg flex items-center gap-1.5`}>
                                        <Icon className={`w-4 h-4 ${status.text}`} />
                                        <span className={`text-xs font-medium ${status.text} capitalize`}>{status.label}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>{d.duration} hari</span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <MobilePagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    // fetchAttendance 2
                    onPageChange={fetchLeaves}
                    />
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default MyLeaves