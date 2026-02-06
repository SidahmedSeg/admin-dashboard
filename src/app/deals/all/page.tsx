"use client";

import { useEffect, useState, useMemo } from "react";
import { adminGetDeals, type Deal } from "@/lib/api";
import { Loader2, AlertCircle, Filter, Search, BarChart3 } from "lucide-react";

const TOKEN_KEY = "admin_token";

const STATUS_CONFIG: Record<string, { label: string; color: string; gradient: string }> = {
  draft: { 
    label: "Draft", 
    color: "text-gray-400",
    gradient: "from-gray-500/10 to-gray-600/10"
  },
  pending_validation: {
    label: "Pending",
    color: "text-amber-400",
    gradient: "from-amber-500/10 to-orange-500/10"
  },
  published: { 
    label: "Published", 
    color: "text-emerald-400",
    gradient: "from-emerald-500/10 to-green-500/10"
  },
  in_discussion: { 
    label: "In Discussion", 
    color: "text-blue-400",
    gradient: "from-blue-500/10 to-cyan-500/10"
  },
  closed: { 
    label: "Closed", 
    color: "text-gray-400",
    gradient: "from-gray-500/10 to-slate-500/10"
  },
};

export default function AllDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  useEffect(() => {
    if (!token) return;
    
    let isMounted = true;
    
    adminGetDeals(token)
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

  const filteredDeals = useMemo(() => {
    let result = filter === "all" ? deals : deals.filter((d) => d.status === filter);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description?.toLowerCase().includes(query) ||
          d.location?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [deals, filter, searchQuery]);

  const statusCounts = useMemo(() => 
    deals.reduce((acc, deal) => {
      acc[deal.status] = (acc[deal.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    [deals]
  );

  if (!token && !loading) return null;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">All Deals</h1>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <BarChart3 className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
          </div>
          <p className="mt-1.5 text-sm text-gray-400">
            View and manage all deals in the system
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#1f1f2e] bg-[#14141f] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <button
          onClick={() => setFilter("all")}
          className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
            filter === "all"
              ? "border-indigo-500/50 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 shadow-lg shadow-indigo-500/10"
              : "border-[#1f1f2e] bg-[#14141f] hover:border-indigo-500/30 hover:bg-[#1a1a28]"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
          <div className="relative">
            <div className={`text-2xl font-bold ${filter === "all" ? "gradient-text" : "text-white"}`}>
              {deals.length}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${filter === "all" ? "bg-indigo-500" : "bg-gray-600"}`} />
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Total</div>
            </div>
          </div>
        </button>

        {Object.entries(statusCounts).map(([status, count]) => {
          const config = STATUS_CONFIG[status];
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
                filter === status
                  ? `border-indigo-500/50 bg-gradient-to-br ${config?.gradient || 'from-gray-500/10 to-gray-600/10'} shadow-lg shadow-indigo-500/10`
                  : "border-[#1f1f2e] bg-[#14141f] hover:border-indigo-500/30 hover:bg-[#1a1a28]"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
              <div className="relative">
                <div className={`text-2xl font-bold ${filter === status ? config?.color || "text-white" : "text-white"}`}>
                  {count}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${filter === status ? "bg-indigo-500" : "bg-gray-600"}`} />
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {config?.label || status}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

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

      {/* Empty state */}
      {!loading && filteredDeals.length === 0 && (
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#1f1f2e] bg-gradient-to-br from-[#14141f] to-[#1a1a28] p-12 text-center animate-slide-up">
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-500/10 to-slate-500/10">
              <Filter className="h-8 w-8 text-gray-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-white">No deals found</h3>
            <p className="mt-2 text-sm text-gray-400">
              {searchQuery
                ? `No deals matching "${searchQuery}"`
                : filter === "all"
                ? "There are no deals in the system yet."
                : `No deals with status "${STATUS_CONFIG[filter]?.label || filter}".`}
            </p>
          </div>
        </div>
      )}

      {/* Deals table */}
      {!loading && filteredDeals.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-[#1f1f2e] bg-[#14141f] shadow-xl animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-[#1f1f2e] bg-[#0f0f17]">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Title</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Off-Plan</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Asking</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Location</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f2e]">
                {filteredDeals.map((deal, index) => {
                  const config = STATUS_CONFIG[deal.status];
                  return (
                    <tr 
                      key={deal.id} 
                      style={{ animationDelay: `${index * 30}ms` }}
                      className="group transition-colors hover:bg-[#1a1a28] animate-fade-in"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">
                          {deal.title}
                        </div>
                        <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                          {deal.description}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg border border-[#1f1f2e] bg-[#0f0f17] px-2.5 py-1 text-xs font-bold ${config?.color || "text-gray-400"}`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${config?.color.replace('text-', 'bg-') || 'bg-gray-500'} shadow-lg`} />
                          {config?.label || deal.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold text-white">
                          {deal.currency} {Number(deal.op_price).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-bold text-emerald-400">
                          {deal.currency} {Number(deal.asking_price).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-400">
                          {deal.location || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-500">
                          {new Date(deal.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
