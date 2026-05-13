import { useState, useEffect } from "react";
import type { LeaveRequest } from "@/types";
import { toast } from "sonner";
import api from "@/lib/axios";

export const useLeaves = () => {
    const [data, setData] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [yearFilter, setYearFilter] = useState<string>(
        String(new Date().getFullYear())
    );

    const fetchLeaves = async () => {
        setLoading(true)
        try {
            const params: Record<string, string> = {};
            if (statusFilter !== "all") params.status = statusFilter;
            if (yearFilter) params.year = yearFilter;
            const res = await api.get("/leaves", {params})
            setData(res.data.data)
        } catch (error) {
            toast.error("Gagal memuat data cuti");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaves();
    }, [statusFilter, yearFilter]);

    const handleApprove = async (request: LeaveRequest) => {
        try {
            await api.patch(`/leaves/${request._id}/review`, { status: "approved" })
            toast.success("Pengajuan berhasil disetujui");
            fetchLeaves();
        } catch (error) {
            toast.error("Gagal menyetujui pengajuan");
        }
    }

    const handleReject = async (request: LeaveRequest, rejectReason: string) => {
        try {
            await api.patch(`/leaves/${request._id}/review`, {status: "rejected", rejectReason})
            toast.success("Pengajuan berhasil ditolak");
            fetchLeaves();
        } catch (error) {
            toast.error("Gagal menolak pengajuan");
        }
    }

    return{
        data,
        loading,
        statusFilter,
        setStatusFilter,
        yearFilter,
        setYearFilter,
        handleApprove,
        handleReject,
    }
}
