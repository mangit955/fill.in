type Props = {
  onAdd: () => void;
};

export default function EmptyState({ onAdd }: Props) {
  return (
    <div className="border border-dashed rounded-md p-8 text-center">
      <p className="text-sm text-gray-600 mb-4">No question yet</p>

      <button onClick={onAdd} className="text-sm text-blue-600 hover:underline">
        {" "}
        + Add your first question
      </button>
    </div>
  );
}
