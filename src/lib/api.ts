const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export type DealStatus =
  | "draft"
  | "pending_validation"
  | "published"
  | "in_discussion"
  | "closed";

export interface Deal {
  id: string;
  owner_user_id: string;
  status: DealStatus;
  title: string;
  description: string;
  op_price: number;
  asking_price: number;
  price_category: string;
  currency: string;
  location: string | null;
  lat: string | null;
  lng: string | null;
  images: { id: string; kind: string; url: string; position: number }[];
  documents: { id: string; file_name: string; url: string; content_type: string; position: number }[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export async function adminLogin(email: string, password: string): Promise<{ access_token: string }> {
  const res = await fetch(`${getApiUrl()}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string })?.detail || "Login failed");
  }
  return res.json();
}

export async function adminGetDeals(token: string, status?: DealStatus): Promise<Deal[]> {
  const url = new URL(`${getApiUrl()}/admin/deals`);
  if (status) url.searchParams.set("status", status);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch deals");
  return res.json();
}

export async function adminApproveDeal(token: string, dealId: string): Promise<Deal> {
  const res = await fetch(`${getApiUrl()}/admin/deals/${dealId}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string })?.detail || "Approve failed");
  }
  return res.json();
}

export async function adminRejectDeal(token: string, dealId: string): Promise<Deal> {
  const res = await fetch(`${getApiUrl()}/admin/deals/${dealId}/reject`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string })?.detail || "Reject failed");
  }
  return res.json();
}
