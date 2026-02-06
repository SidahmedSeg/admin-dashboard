"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogin } from "@/lib/api";
import { Lock, Mail, Zap, Shield, TrendingUp } from "lucide-react";

const TOKEN_KEY = "admin_token";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { access_token } = await adminLogin(email.trim(), password);
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, access_token);
      }
      router.push("/deals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0f] p-4 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      {/* Stats cards */}
      <div className="absolute left-8 top-8 hidden space-y-3 lg:block animate-slide-in">
        <div className="rounded-xl border border-[#1f1f2e] bg-[#14141f]/80 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/10 to-green-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-400" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xs text-gray-500">Uptime</div>
              <div className="text-lg font-bold text-white">99.9%</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[#1f1f2e] bg-[#14141f]/80 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <Shield className="h-5 w-5 text-blue-400" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xs text-gray-500">Security</div>
              <div className="text-lg font-bold text-white">AES-256</div>
            </div>
          </div>
        </div>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Logo section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/30">
            <Zap className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="mt-2 text-sm text-gray-400">Secure access to dashboard</p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-[#1f1f2e] bg-gradient-to-br from-[#14141f] to-[#1a1a28] p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" strokeWidth={2.5} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#1f1f2e] bg-[#0f0f17] py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" strokeWidth={2.5} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#1f1f2e] bg-[#0f0f17] py-3 pl-10 pr-4 text-white placeholder-gray-600 transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 animate-slide-up">
                <p className="text-sm font-medium text-red-400">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" strokeWidth={2.5} />
                    <span>Sign In</span>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>Encrypted connection • End-to-end secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}

