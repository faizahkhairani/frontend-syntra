import { Button } from "../ui/button"
import { useLogin } from "@/hooks/useLogin"

const DemoLoginButtons = () => {
  const { login, isLoading } = useLogin()

  return (
    <div className="border-slate-200">
        <div className="flex items-center gap-4 my-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground font-medium">
                OR
            </span>
            <div className="h-px flex-1 bg-border" />
        </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="flex-1 h-10 text-sm"
          onClick={() => login("demo.admin@syntra.app", "demo123")}
        >
          Coba Demo Admin
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="flex-1 h-10 text-sm"
          onClick={() => login("demo.karyawan@syntra.app", "demo123")}
        >
          Coba Demo Karyawan
        </Button>
      </div>
    </div>
  )
}

export default DemoLoginButtons