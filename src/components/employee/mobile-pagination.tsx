import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobilePaginationProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

const MobilePagination = ({ page, totalPages, total, onPageChange }: MobilePaginationProps) => {
  

  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-xs text-muted-foreground">
        Total {total} data
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline" size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline" size="icon"
          className="h-8 w-8"
          // onPageChange 2
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default MobilePagination