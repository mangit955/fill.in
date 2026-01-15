import { Trash2 } from "lucide-react";

type Props = {
  onDelete: () => void;
};

export default function BlockActions({ onDelete }: Props) {
  function handleDelete() {
    onDelete();
  }

  return <div className="flex left-2 items-center text-neutral-400 "></div>;
}
