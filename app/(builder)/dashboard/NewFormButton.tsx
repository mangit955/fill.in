"use client";

import { Plus } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function NewFormButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="default" disabled={pending}>
      {pending ? (
        <>
          <Spinner width={18} height={18} className="mr-2" />
          Creating...
        </>
      ) : (
        <>
          <Plus width={20} height={20} className="mr-2" />
          New form
        </>
      )}
    </Button>
  );
}
