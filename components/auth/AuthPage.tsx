// components/auth/AuthPage.tsx
"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import Image from "next/image";
import { Spinner } from "../ui/spinner";
import { FillinLogo } from "../ui/svg/logo";
import Link from "next/link";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  async function signInWithEmail() {
    setLoading(true);

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    alert("Check your email for login link");
  }

  async function signInWithGoogle() {
    setLoading(true);
    setLoadingProvider("google");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function signInWithGithub() {
    setLoading(true);
    setLoadingProvider("github");
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xs space-y-6">
        <Link href="/">
          <FillinLogo className="mb-10 text-neutral-400 cursor-pointer hover:text-neutral-500" />
        </Link>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-neutral-700 leading-tight text-left">
            {mode === "login" ? "Welcome back" : "Create Your Fill.in account"}
          </h1>
          <p className="text-md text-neutral-400 font-semibold leading-snug text-left">
            Get started with the simplest way to create forms.
          </p>
        </div>

        {/* Google */}
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full font-semibold text-neutral-500 cursor-pointer border rounded-md px-4 py-1 flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          {loadingProvider === "google" ? (
            <Spinner width={18} height={18} />
          ) : (
            <>
              <Image src="/google.svg" alt="google" width={18} height={18} />
              Continue with Google
            </>
          )}
        </button>

        {/* GitHub */}
        <button
          onClick={signInWithGithub}
          disabled={loading}
          className="w-full font-semibold text-neutral-500 cursor-pointer border rounded-md px-4 py-1 flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          {loadingProvider === "github" ? (
            <Spinner width={18} height={18} />
          ) : (
            <>
              <Image src="/github.png" alt="github" width={24} height={24} />
              Continue with GitHub
            </>
          )}
        </button>

        <div className="text-center text-sm text-muted-foreground">or</div>

        {/* Email magic link */}
        <h2 className="font-semibold">Email</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border focus:outline-none focus:ring-3 focus:ring-blue-200 border-neutral-300 shadow-sm rounded-md px-3 py-2"
        />

        <button
          onClick={signInWithEmail}
          disabled={loading}
          className="w-full cursor-pointer hover:bg-black/80 flex items-center justify-center  bg-black text-white font-bold rounded-md py-2"
        >
          {loading ? (
            <Spinner width={20} height={20} strokeWidth={3} />
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
