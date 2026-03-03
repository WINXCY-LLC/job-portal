/**
 * 沖縄メディケアワーク ロゴコンポーネント
 *
 * アイコンマーク:
 *   - 対角グラデーション（ティール明 → ティール深）
 *   - 白い医療十字（適切なプロポーション）
 *   - 右上：沖縄の太陽（コーラル＋ゴールドの2層円）
 *   - 下部：沖縄の海を表す2本の波線（半透明白）
 *   - 上部：内側ハイライト（立体感）
 *
 * ワードマーク:
 *   - sm / md : 「沖縄（珊瑚色）メディケアワーク（深ティール）」横並び
 *   - lg      : 「OKINAWA」上段 ＋「メディケアワーク」下段の縦積み
 */

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

/* ─── サイズ設定 ─── */
const S = {
  sm: {
    box: 30, rx: 8,
    // 十字（縦: x y w h rx、横: x y w h rx）
    cv: [12, 5,   6, 20, 2.5] as const,
    ch: [ 5, 12, 20,  6, 2.5] as const,
    sunR: 8.5,
    waveY: [0.75, 0.87] as const,
    waveAmp: [0.065, 0.055] as const,
    gap: "gap-2",
    textCls: "text-sm font-bold tracking-tight",
    stack: false,
  },
  md: {
    box: 38, rx: 10,
    cv: [15,  6,  8, 26, 3.2] as const,
    ch: [ 6, 15, 26,  8, 3.2] as const,
    sunR: 11,
    waveY: [0.76, 0.87] as const,
    waveAmp: [0.07, 0.058] as const,
    gap: "gap-2.5",
    textCls: "text-[1.05rem] font-bold tracking-tight",
    stack: false,
  },
  lg: {
    box: 52, rx: 14,
    cv: [21,  8, 10, 36, 4.2] as const,
    ch: [ 8, 21, 36, 10, 4.2] as const,
    sunR: 15,
    waveY: [0.77, 0.88] as const,
    waveAmp: [0.072, 0.06] as const,
    gap: "gap-3",
    textCls: "text-xl font-bold tracking-tight",
    stack: true,
  },
} as const;

/* ─── 波パスジェネレーター（Cubic Bézier） ─── */
function wavePath(b: number, yRatio: number, ampRatio: number): string {
  const y   = b * yRatio;
  const amp = b * ampRatio;
  const x0  = b * 0.06;
  const x1  = b * 0.31;
  const x2  = b * 0.5;
  const x3  = b * 0.69;
  const x4  = b * 0.94;
  return [
    `M${x0.toFixed(1)} ${y.toFixed(1)}`,
    `C${(x0 + (x1 - x0) * 0.5).toFixed(1)} ${(y - amp).toFixed(1)}`,
    ` ${(x1 - (x1 - x0) * 0.3).toFixed(1)} ${(y - amp).toFixed(1)}`,
    ` ${x1.toFixed(1)} ${y.toFixed(1)}`,
    `C${(x1 + (x2 - x1) * 0.5).toFixed(1)} ${(y + amp).toFixed(1)}`,
    ` ${(x2 - (x2 - x1) * 0.3).toFixed(1)} ${(y + amp).toFixed(1)}`,
    ` ${x2.toFixed(1)} ${y.toFixed(1)}`,
    `C${(x2 + (x3 - x2) * 0.5).toFixed(1)} ${(y - amp).toFixed(1)}`,
    ` ${(x3 - (x3 - x2) * 0.3).toFixed(1)} ${(y - amp).toFixed(1)}`,
    ` ${x3.toFixed(1)} ${y.toFixed(1)}`,
    `C${(x3 + (x4 - x3) * 0.5).toFixed(1)} ${(y + amp).toFixed(1)}`,
    ` ${(x4 - (x4 - x3) * 0.3).toFixed(1)} ${(y + amp).toFixed(1)}`,
    ` ${x4.toFixed(1)} ${y.toFixed(1)}`,
  ].join(" ");
}

/* ─── コンポーネント本体 ─── */
export function Logo({ size = "md" }: LogoProps) {
  const c = S[size];
  const b = c.box;

  return (
    <span
      className={`inline-flex items-center ${c.gap} leading-none select-none`}
      role="img"
      aria-label="沖縄メディケアワーク"
    >
      {/* ══════════ アイコンマーク ══════════ */}
      <span
        className="relative shrink-0 inline-block overflow-hidden"
        style={{
          width: b,
          height: b,
          borderRadius: c.rx,
          background: "linear-gradient(140deg, #2dd4bf 0%, #0d9488 48%, #0f766e 100%)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.18)",
            "inset 0 -1px 0 rgba(0,0,0,0.12)",
            "0 2px 6px rgba(15,118,110,0.35)",
          ].join(", "),
        }}
      >
        <svg
          width={b}
          height={b}
          viewBox={`0 0 ${b} ${b}`}
          fill="none"
          aria-hidden="true"
        >
          {/* ── 上部ハイライト（立体感） ── */}
          <rect
            x={0} y={0}
            width={b} height={b * 0.52}
            fill="rgba(255,255,255,0.08)"
          />

          {/* ── 医療十字 ── */}
          {/* 縦 */}
          <rect
            x={c.cv[0]} y={c.cv[1]}
            width={c.cv[2]} height={c.cv[3]}
            rx={c.cv[4]}
            fill="white"
            fillOpacity="0.96"
          />
          {/* 横 */}
          <rect
            x={c.ch[0]} y={c.ch[1]}
            width={c.ch[2]} height={c.ch[3]}
            rx={c.ch[4]}
            fill="white"
            fillOpacity="0.96"
          />
          {/* 中心のインナーハイライト（交差点） */}
          <rect
            x={c.cv[0]} y={c.ch[1]}
            width={c.cv[2]} height={c.ch[3]}
            rx={Math.min(c.cv[4], c.ch[4]) * 0.6}
            fill="rgba(255,255,255,0.18)"
          />

          {/* ── 沖縄の太陽（右上コーナー） ── */}
          {/* アウターグロー */}
          <circle
            cx={b} cy={0} r={c.sunR * 1.25}
            fill="#f97316"
            fillOpacity="0.18"
          />
          {/* メインコーラル */}
          <circle
            cx={b} cy={0} r={c.sunR}
            fill="#f97316"
            fillOpacity="0.92"
          />
          {/* インナーゴールド（輝き） */}
          <circle
            cx={b} cy={0} r={c.sunR * 0.58}
            fill="#fbbf24"
            fillOpacity="0.82"
          />

          {/* ── 沖縄の海（波線 2本） ── */}
          <path
            d={wavePath(b, c.waveY[0], c.waveAmp[0])}
            stroke="white"
            strokeWidth={b * 0.045}
            strokeLinecap="round"
            fill="none"
            strokeOpacity="0.28"
          />
          <path
            d={wavePath(b, c.waveY[1], c.waveAmp[1])}
            stroke="white"
            strokeWidth={b * 0.038}
            strokeLinecap="round"
            fill="none"
            strokeOpacity="0.18"
          />
        </svg>
      </span>

      {/* ══════════ ワードマーク ══════════ */}
      {c.stack ? (
        /* lg: 2行縦積みレイアウト */
        <span className="flex flex-col leading-snug">
          <span
            className="font-black uppercase tracking-[0.22em] leading-none"
            style={{
              color: "#f97316",
              fontSize: `${(b * 0.22).toFixed(0)}px`,
              textShadow: "0 1px 2px rgba(249,115,22,0.15)",
            }}
          >
            OKINAWA
          </span>
          <span
            className={`${c.textCls} leading-tight`}
            style={{
              color: "#0f766e",
            }}
          >
            メディケアワーク
          </span>
        </span>
      ) : (
        /* sm / md: 横並びレイアウト */
        <span className={c.textCls}>
          <span style={{ color: "#f97316" }}>沖縄</span>
          <span
            style={{
              color: "#0f766e",
              borderLeft: `1.5px solid #d1faf5`,
              paddingLeft: size === "sm" ? "5px" : "7px",
              marginLeft: size === "sm" ? "4px" : "5px",
            }}
          >
            メディケアワーク
          </span>
        </span>
      )}
    </span>
  );
}
