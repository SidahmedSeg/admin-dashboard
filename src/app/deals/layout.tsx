"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const TOKEN_KEY = "admin_token";

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  return <DashboardLayout>{children}</DashboardLayout>;
}
