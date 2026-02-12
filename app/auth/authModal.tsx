"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { Spinner } from "../../components/ui/spinner";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
};

export default function AuthModal({ open, onOpenChange, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  async function loginWithEmail() {
    if (!email) return;

    setLoading(true);

    // Store current URL for redirect after login
    sessionStorage.setItem("redirect_after_auth", window.location.pathname);
    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Magic link sent. Check your email.");
    // mark that publish should continue after login
    sessionStorage.setItem("post_login_publish", "true");
    setCooldown(30);
  }

  useEffect(() => {
    if (cooldown === 0) return;
    const t = setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const shouldPublish = sessionStorage.getItem("post_login_publish");
          if (shouldPublish === "true") {
            sessionStorage.removeItem("post_login_publish");
            onOpenChange(false);
            onSuccess?.();
          }
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [onOpenChange, onSuccess]);

  async function loginWithProvider(provider: "google" | "github") {
    // Store current URL for redirect after login
    sessionStorage.setItem("redirect_after_auth", window.location.pathname);
    // mark that publish should continue after login
    sessionStorage.setItem("post_login_publish", "true");

    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`;

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/10 backdrop-blur">
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login to publish</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* OAuth buttons */}
            <Button
              variant="outline"
              className="w-full flex py-2 items-center justify-center gap-2"
              onClick={() => loginWithProvider("google")}
            >
              <Image
                src="/google.svg"
                alt="google"
                width={18}
                height={18}
                className="object-contain"
              />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full py-2 flex items-center justify-center gap-2"
              onClick={() => loginWithProvider("github")}
            >
              <Image
                src="/github.png"
                alt="github"
                width={22}
                height={22}
                className="object-contain"
              />
              Continue with GitHub
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              or continue with email
            </div>

            {/* Email login */}
            <div className="flex gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-4! focus:ring-blue-200! shadow-sm border border-gray-300"
              />
              <button
                className="border rounded-md bg-black text-white px-2 py-1 font-semibold cursor-pointer hover:bg-black/80 "
                onClick={loginWithEmail}
                disabled={loading || cooldown > 0}
              >
                {loading ? (
                  <Spinner width={20} height={20} strokeWidth={3} />
                ) : cooldown > 0 ? (
                  `Wait ${cooldown}s`
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
