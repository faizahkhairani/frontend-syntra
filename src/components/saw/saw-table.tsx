import { useRecommendations } from "@/hooks/useSaw";
import { DataTable } from "./table/table"
import { getColumn } from "./table/column";
import { useState } from "react";
import { Input } from "../ui/input"
import { Search } from "lucide-react"

const SawTable = () => {
    const {
        data,
        loading
    } = useRecommendations()
    const [search, setSearch] = useState("")

    const filtered = data.filter((u) =>
        u.userId.name.toLowerCase().includes(search.toLowerCase())
    )

    const columns = getColumn()
  return (
    <div className="space-y-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <DataTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        />
    </div>
  )
}

export default SawTable