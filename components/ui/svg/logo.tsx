export function FillinLogo({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* --- STEM --- */}
      <path d="M 44 95 C 46 80 48 65 50 55 C 52 65 54 80 56 95 Z" />

      {/* --- LEAVES --- */}
      <g>
        <path d="M50 55 C35 45 30 20 50 10 C70 20 65 45 50 55 Z" />
        <path d="M50 55 C40 65 10 60 5 50 C10 30 35 40 50 55 Z" />
        <path d="M50 55 C60 65 90 60 95 50 C90 30 65 40 50 55 Z" />
      </g>

      {/* subtle highlight */}
      <path
        d="M 50 60 L 50 90"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.1"
      />
    </svg>
  );
}
