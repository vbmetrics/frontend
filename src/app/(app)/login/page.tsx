"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setE] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) { setErr(await r.text()); return; }
    window.location.href = "/"; // np. dashboard
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
      <h1>Logowanie</h1>
      <input value={email} onChange={e=>setE(e.target.value)} placeholder="email" />
      <input value={password} onChange={e=>setP(e.target.value)} type="password" placeholder="password" />
      <button type="submit">Zaloguj</button>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
    </form>
  );
}
