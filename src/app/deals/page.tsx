"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  adminApproveDeal,
  adminGetDeals,
  adminRejectDeal,
  type Deal,
} from "@/lib/api";
import { Check, X, MapPin, Loader2, AlertCircle, Sparkles, TrendingDown, TrendingUp, Minus, Clock } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

const TOKEN_KEY = "admin_token";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  useEffect(() => {
    if (!token) return;
    
    let isMounted = true;
    
    adminGetDeals(token, "pending_validation")
      .then((data) => {
        if (isMounted) setDeals(data);
      })
      .catch(() => {
        if (isMounted) setError("Failed to load deals");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleApprove = useCallback(async (dealId: string) => {
    if (!token) return;
    setActioningId(dealId);
    try {
      await adminApproveDeal(token, dealId);
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed");
    } finally {
      setActioningId(null);
    }
  }, [token]);

  const handleReject = useCallback(async (dealId: string) => {
    if (!token) return;
    setActioningId(dealId);
    try {
      await adminRejectDeal(token, dealId);
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reject failed");
    } finally {
      setActioningId(null);
    }
  }, [token]);

  const calculateDiscount = (opPrice: number, askingPrice: number) => {
    return ((opPrice - askingPrice) / opPrice * 100).toFixed(1);
  };

  const columns: ColumnDef<Deal>[] = useMemo(() => [
    {
      accessorKey: "title",
      header: "Deal",
      cell: ({ row }) => {
        const deal = row.original;
        return (
          <div className="min-w-[200px]">
            <div className="font-bold text-white text-sm">{deal.title}</div>
            <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">
              {deal.description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "op_price",
      header: "Off-Plan Price",
      cell: ({ row }) => {
        const deal = row.original;
        return (
          <div className="text-sm font-bold text-white">
            {deal.currency} {Number(deal.op_price).toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "asking_price",
      header: "Asking Price",
      cell: ({ row }) => {
        const deal = row.original;
        return (
          <div className="text-sm font-bold text-emerald-400">
            {deal.currency} {Number(deal.asking_price).toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "discount",
      header: "Discount",
      cell: ({ row }) => {
        const deal = row.original;
        const opPrice = Number(deal.op_price);
        const askingPrice = Number(deal.asking_price);
        const discount = calculateDiscount(opPrice, askingPrice);
        
        if (parseFloat(discount) > 0) {
          return (
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 w-fit">
              <TrendingDown className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-emerald-400">{discount}%</span>
            </div>
          );
        }
        
        if (parseFloat(discount) < 0) {
          return (
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 w-fit">
              <TrendingUp className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-amber-400">+{Math.abs(parseFloat(discount))}%</span>
            </div>
          );
        }
        
        return (
          <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1.5 w-fit">
            <Minus className="h-3.5 w-3.5 text-blue-400" strokeWidth={2.5} />
            <span className="text-xs font-bold text-blue-400">Equal</span>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const deal = row.original;
        return deal.location ? (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
            <span>{deal.location}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-600">—</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const deal = row.original;
        const isActioning = actioningId === deal.id;
        
        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApprove(deal.id)}
              disabled={actioningId !== null}
              className="group relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/20 transition-all hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50 disabled:hover:scale-100"
              title="Approve"
            >
              {isActioning && actioningId === deal.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" strokeWidth={2.5} />
              ) : (
                <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleReject(deal.id)}
              disabled={actioningId !== null}
              className="group relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/20 transition-all hover:scale-110 hover:shadow-xl hover:shadow-red-500/30 disabled:opacity-50 disabled:hover:scale-100"
              title="Reject"
            >
              {isActioning && actioningId === deal.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" strokeWidth={2.5} />
              ) : (
                <X className="h-4 w-4 text-white" strokeWidth={2.5} />
              )}
            </button>
          </div>
        );
      },
    },
  ], [actioningId, handleApprove, handleReject]);

  ], [actioningId, handleApprove, handleReject]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Pending Validation</h1>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
              <Clock className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
          </div>
          <p className="mt-1.5 text-sm text-gray-400">
            Review and approve deals submitted for validation
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#1f1f2e] bg-gradient-to-br from-[#14141f] to-[#1a1a28] px-5 py-3 shadow-xl">
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">{deals.length}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Pending</div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 backdrop-blur-sm animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-red-400">Error</h3>
              <p className="mt-1 text-sm text-red-300/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#1f1f2e] bg-[#14141f]">
          <div className="text-center">
            <div className="relative mb-4 inline-block">
              <div className="h-12 w-12 rounded-full border-2 border-indigo-500/20" />
              <Loader2 className="absolute inset-0 h-12 w-12 animate-spin text-indigo-500" strokeWidth={2} />
            </div>
            <p className="text-sm font-medium text-gray-400">Loading deals...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && deals.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#1f1f2e] bg-gradient-to-br from-[#14141f] to-[#1a1a28] p-12 text-center animate-slide-up">
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10">
              <Sparkles className="h-8 w-8 text-emerald-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-white">All caught up!</h3>
            <p className="mt-2 text-sm text-gray-400">
              No deals are pending validation at the moment.
            </p>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && deals.length > 0 && (
        <DataTable columns={columns} data={deals} />
      )}
    </div>
  );
}
