// src/lib/api/me.ts (server util)
import { cookies } from "next/headers";

export type Me = {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "user" | string;
};

export async function getMe(): Promise<Me | null> {
  const cookie = (await cookies()).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE ?? ""}/api/backend/api/v1/auth/me`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}
