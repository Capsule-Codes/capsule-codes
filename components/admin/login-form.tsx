"use client";
import { useState, type FormEvent } from "react";
import { Magnetic } from "@/components/motion/magnetic";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await signIn(email, password);
      if (result.error) setError(result.error);
    } catch {
      setError("Internal server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div
        style={{ background: "radial-gradient(ellipse at top, oklch(0.4 0.18 180 / 0.25), transparent 60%), var(--ink-bg-2)" }}
        className="border border-[color:oklch(0.5_0.18_180_/_0.4)] rounded-3xl p-9"
      >
        <div className="text-center mb-7">
          <div className="font-mono text-lg font-semibold">capsule<span className="text-[color:var(--brand-cyan)]">.</span>admin</div>
          <p className="text-[12.5px] text-[color:var(--ink-muted)] mt-1">Sign in to manage content</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--ink-muted)] mb-1.5 block">Email</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[color:oklch(0.06_0_0)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 text-sm text-foreground placeholder:text-[color:var(--ink-muted)] focus:outline-none focus:border-[color:var(--brand-cyan)]/50"
              placeholder="you@capsulecodes.com"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.06em] text-[color:var(--ink-muted)] mb-1.5 block">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[color:oklch(0.06_0_0)] border border-[color:var(--ink-line)] rounded-[10px] px-3.5 py-3 text-sm text-foreground placeholder:text-[color:var(--ink-muted)] focus:outline-none focus:border-[color:var(--brand-cyan)]/50"
            />
          </div>
          {error && <p className="text-[12px] text-[color:oklch(0.65_0.2_25)]">{error}</p>}
          <div className="flex justify-end mt-2">
            <Magnetic>
              <button type="submit" disabled={submitting} className="brand-grad text-black rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Signing in…" : "Sign in →"}
              </button>
            </Magnetic>
          </div>
        </form>
      </div>
    </div>
  );
}
