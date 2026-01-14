type Props = {
  onDelete: () => void;
};

export default function BlockActions({ onDelete }: Props) {
  function handleDelete() {
    const ok = window.confirm("Are you sure you want to delete this question?");
    if (ok) onDelete();
  }
  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
