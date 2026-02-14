"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Props = {
  formId: string;
};

export default function CollaboratorsLiveRefresh({ formId }: Props) {
  const router = useRouter();
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel(`form-members-${formId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "form_members",
          filter: `form_id=eq.${formId}`,
        },
        () => {
          if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
          }

          // Coalesce bursts (invite/remove) into one server refresh.
          refreshTimeoutRef.current = setTimeout(() => {
            router.refresh();
          }, 250);
        },
      )
      .subscribe();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [formId, router]);

  return null;
}
