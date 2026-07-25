import { useState } from "react";
import type { LeaveRequest } from "@/types";
import type { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { useIsDemo } from "@/hooks/useDemo";

interface Props {
  row: Row<LeaveRequest>
  onApprove: (request: LeaveRequest) => void;
  onReject: (request: LeaveRequest, reason: string) => void;
}

const TableRowActions = ({row, onApprove, onReject}: Props) => {
    const request = row.original
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    if (request.status !== "pending") return null;

    const handleReject = () => {
        if (!rejectReason.trim()) return;
        onReject(request, rejectReason); // ← row.original + reason naik ke useLeaves
        setRejectDialogOpen(false);
        setRejectReason("");
    };

    const isDemo = useIsDemo()


  return (
    <div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50"
            onClick={() => onApprove(request)} // ← row.original naik ke useLeaves
            disabled={isDemo}
          >
          <Check className="w-4 h-4 mr-1" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50"
          onClick={() => setRejectDialogOpen(true)} // ← buka dialog dulu
        >
          <X className="w-4 h-4 mr-1" />
          Reject
        </Button>
        </div>
        {/* Dialog cuma buat nampung reason */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tolak Pengajuan Cuti</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <p className="text-sm text-muted-foreground">
                Pengajuan dari{" "}
                <span className="font-medium text-foreground">
                  {request.userId.name}
                </span>
              </p>
              <Label htmlFor="rejectReason">Alasan Penolakan</Label>
              <Textarea
                id="rejectReason"
                placeholder="Tuliskan alasan penolakan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject} // ← onReject dipanggil di sini
                disabled={!rejectReason.trim() || isDemo}
              >
                Tolak
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default TableRowActions