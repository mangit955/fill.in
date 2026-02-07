import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/lib/forms/types";
import FormRuntime from "../runtime/FormRuntime";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Props = {
  form: Form;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Preview({ form, open, onOpenChange }: Props) {
  const [instanceKey, setInstanceKey] = useState(0);

  useEffect(() => {
    if (open) {
      setInstanceKey(Date.now());
    }
  }, [open, form.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[900px] max-w-[90vw] h-[80vh] p-0">
        <VisuallyHidden>
          <DialogTitle>Form preview</DialogTitle>
        </VisuallyHidden>

        <div className="w-full h-full overflow-y-auto p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <FormRuntime key={`${form.id}-${instanceKey}`} form={form} preview />
        </div>
      </DialogContent>
    </Dialog>
  );
}
