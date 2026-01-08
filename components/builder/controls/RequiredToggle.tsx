"use client";

type RequiredToggleProps = {
  required: boolean;
  onChange: (value: boolean) => void;
};

export default function RequiredToggle({
  required,
  onChange,
}: RequiredToggleProps) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={required}
        onChange={(e) => onChange(e.target.checked)}
      />
      Required
    </label>
  );
}
