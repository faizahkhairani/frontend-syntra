import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Controller } from "react-hook-form"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Button } from "../ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import api from "@/lib/axios"

const formSchema = z.object({
    name:       z.string().min(1, "Nama wajib diisi"),
    email:      z.string().email("Email tidak valid"),
    password:   z.string().min(6, "Password minimal 6 karakter"),
    phone:      z.string().min(1, "No. HP wajib diisi"),
    department: z.string().min(1, "Department wajib diisi"),
    gender:     z.enum(["Male", "Female"], {message: "Gender wajib dipilih",}),
    role:       z.enum(["employee", "admin"]), 
})

type FormValues = z.infer<typeof formSchema>

interface usersFormProbs {
    onClose: () => void,
    onSuccess: () => void
}


    const UsersForm = ({onClose, onSuccess}: usersFormProbs) => {
        const {
        register,
        handleSubmit,
        control,      
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "", email: "", password: "",
            phone: "", department: "", role: "employee", gender: "Male",
        },

    })

    const onSubmit = async (data: FormValues) => {
        console.log(data)
        try {
            await api.post("/users", data)
            toast.success("Staff berhasil ditambahkan")
            onSuccess?.()
            onClose()
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Gagal menambahkan staff")
        }

    }

        
  return (
    <div className="h-auto w-full max-w-full">
        <div className="h-full">
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
                <FieldSet>
                    <div className="border-b pb-2">
                        <FieldLegend className="mb-2 text-center text-xl font-semibold tracking-[-0.16px] sm:text-left dark:text-[#fcfdffef]">
                                  Menambahkan Staff Baru
                        </FieldLegend>
                        <FieldDescription className="text-muted-foreground text-sm leading-tight">
                            Organize and manage staff, resources, and team collaboration
                        </FieldDescription>
                    </div>
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
                        "Create User"
                        )}
                    </Button>
                    <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                </Field>
            </FieldGroup>
           </form>
        </div>
    </div>
  )
}

export default UsersForm