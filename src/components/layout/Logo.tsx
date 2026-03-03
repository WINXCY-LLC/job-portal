interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? 24 : size === "lg" ? 40 : 30;
  const textClass =
    size === "sm"
      ? "text-sm font-bold"
      : size === "lg"
      ? "text-2xl font-bold"
      : "text-[1.05rem] font-bold";

  return (
    <span className={`inline-flex items-center gap-2 leading-none ${textClass}`}>
      {/* 医療十字 SVG アイコン */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        {/* 丸みのある四角背景 — ティールグリーン */}
        <rect width="32" height="32" rx="8" fill="#0D9488" />
        {/* 白い医療十字 */}
        <rect x="13" y="6" width="6" height="20" rx="2" fill="white" />
        <rect x="6" y="13" width="20" height="6" rx="2" fill="white" />
        {/* サンゴ色のアクセントドット（右下） */}
        <circle cx="25" cy="25" r="3.5" fill="#F97316" />
      </svg>

      {/* テキスト */}
      <span>
        <span style={{ color: "#F97316" }}>沖縄</span>
        <span style={{ color: "#0D9488" }}>メディケアワーク</span>
      </span>
    </span>
  );
}
