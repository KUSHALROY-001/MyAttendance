import { useTheme } from "../../../../contexts/ThemeContext";

/**
 * FolderStructureDiagram
 * Inline SVG recreation of the MyDrive folder structure guide.
 * Automatically adapts colors to the current dark / light theme.
 */
export default function FolderStructureDiagram() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  // ── Colour palette ──────────────────────────────────────────────────
  const stroke = dark ? "#3A3A42" : "#475569"; // arrows + node borders
  const textMain = dark ? "#f1f5f9" : "#1e293b"; // node labels
  const nodeFill = dark ? "#19191D" : "#ffffff";
  const dimDot = dark ? "#64748b" : "#94a3b8"; // the "···" ellipsis

  const blueFill = dark ? "#1d4ed8" : "#93c5fd";
  const blueText = dark ? "#ffffff" : "#1e3a8a";

  const greenBorder = dark ? "#4ade80" : "#16a34a";
  const greenText = dark ? "#4ade80" : "#15803d";

  // Unique marker IDs per render so dark/light don't bleed into each other
  const solidId = dark ? "arr-s-d" : "arr-s-l";
  const dashId = dark ? "arr-d-d" : "arr-d-l";

  // ── Shared helpers ───────────────────────────────────────────────────
  const Arrow = ({ id }) => (
    <marker
      id={id}
      markerWidth="8"
      markerHeight="8"
      refX="7"
      refY="3"
      orient="auto"
    >
      <path d="M0,0 L0,6 L8,3 z" fill={stroke} />
    </marker>
  );

  // Rounded rect node with centred single-line text
  const Node = ({ cx, cy, w = 90, h = 36, r = 9, label, fontSize = 13 }) => (
    <g>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={r}
        fill={nodeFill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      <text
        x={cx}
        y={cy + fontSize * 0.35}
        textAnchor="middle"
        fontSize={fontSize}
        fill={textMain}
      >
        {label}
      </text>
    </g>
  );

  // Curved path (cubic bezier) from one point to another
  const Curve = ({ x1, y1, x2, y2, mx }) => {
    const d = `M ${x1},${y1} C ${mx},${y1} ${mx},${y2} ${x2},${y2}`;
    return (
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        markerEnd={`url(#${solidId})`}
      />
    );
  };

  // ── Layout constants ─────────────────────────────────────────────────
  // Tree node centre x-positions
  const CX_MY = 150;
  const CX_SEM = 320;
  const CX_SUB = 510;
  const CX_NOTE = 718;

  // Tree node centre y-positions
  const SEM_YS = [112, 164, 213, 295]; // Sem1, Sem2, Sem3, Sem(n)
  const SUB_YS = [112, 164, 213, 295]; // Sub_1 … Sub_n
  const DOTS_Y = 257;
  const MY_CY = 195;

  // MyDrive right edge / Sem fan origin / Sub right edge
  const MY_RX = CX_MY + 60; // 210
  const FAN_X = CX_SEM + 45; // 365  (fan origin for Sem→Sub arrows)
  const SUB_RX = CX_SUB + 52.5; // 562.5
  const NOTE_LX = CX_NOTE - 76; // 642  (NoteShare / NoteMore left edge)

  // Bottom label y-centre
  const LABEL_CY = 458;
  const LABEL_H = 36;
  const LABEL_TOP = LABEL_CY - LABEL_H / 2; // 440

  // "Always share" green box
  const ALWAYS_CY = 540;
  const ALWAYS_H = 46;
  const ALWAYS_TOP = ALWAYS_CY - ALWAYS_H / 2; // 517

  // Note box geometry
  const NOTE_SHARE_CY = 112;
  const NOTE_SHARE_H = 52;
  const NOTE_MORE_CY = 218;
  const NOTE_MORE_H = 62;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 920 600"
        className="mx-auto w-full max-w-4xl"
        aria-label="Google Drive folder structure guide"
      >
        <defs>
          <Arrow id={solidId} />
          <Arrow id={dashId} />
        </defs>

        {/* ── MyDrive → Sem nodes (curved fan) ─────────────────────── */}
        {SEM_YS.map((sy) => (
          <Curve
            key={`my-sem-${sy}`}
            x1={MY_RX}
            y1={MY_CY}
            x2={CX_SEM - 45}
            y2={sy}
            mx={244}
          />
        ))}

        {/* ── Sem group → Sub nodes (curved fan from virtual point) ── */}
        {SUB_YS.map((sy) => (
          <Curve
            key={`sem-sub-${sy}`}
            x1={FAN_X}
            y1={190}
            x2={CX_SUB - 52.5}
            y2={sy}
            mx={408}
          />
        ))}

        {/* ── Sub_1 → NoteShare ───────────────────────────────────── */}
        <line
          x1={SUB_RX}
          y1={NOTE_SHARE_CY}
          x2={NOTE_LX}
          y2={NOTE_SHARE_CY}
          stroke={stroke}
          strokeWidth="1.5"
          markerEnd={`url(#${solidId})`}
        />

        {/* ── Sub_3 → NoteMore (centre of note box) ───────────────── */}
        <line
          x1={SUB_RX}
          y1={213}
          x2={NOTE_LX}
          y2={NOTE_MORE_CY}
          stroke={stroke}
          strokeWidth="1.5"
          markerEnd={`url(#${solidId})`}
        />

        {/* ── Dashed label → node arrows ──────────────────────────── */}
        {/* Your Main Folder → MyDrive */}
        <line
          x1={CX_MY}
          y1={LABEL_TOP}
          x2={CX_MY}
          y2={MY_CY + 22}
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="7,4"
          markerEnd={`url(#${dashId})`}
        />

        {/* Sem Folder → Sem(n) */}
        <line
          x1={CX_SEM}
          y1={LABEL_TOP}
          x2={CX_SEM}
          y2={SEM_YS[3] + 18}
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="7,4"
          markerEnd={`url(#${dashId})`}
        />

        {/* Subject Folder → Sub_n */}
        <line
          x1={CX_SUB}
          y1={LABEL_TOP}
          x2={CX_SUB}
          y2={SUB_YS[3] + 18}
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="7,4"
          markerEnd={`url(#${dashId})`}
        />

        {/* Also share → NoteMore */}
        <line
          x1={CX_NOTE}
          y1={LABEL_TOP}
          x2={CX_NOTE}
          y2={NOTE_MORE_CY + NOTE_MORE_H / 2}
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="7,4"
          markerEnd={`url(#${dashId})`}
        />

        {/* Always share → Subject Folder (solid) */}
        <line
          x1={CX_SUB}
          y1={ALWAYS_TOP}
          x2={CX_SUB}
          y2={LABEL_CY + LABEL_H / 2}
          stroke={stroke}
          strokeWidth="1.5"
          markerEnd={`url(#${solidId})`}
        />

        {/* ── TREE NODES ────────────────────────────────────────────── */}
        <Node
          cx={CX_MY}
          cy={MY_CY}
          w={120}
          h={44}
          r={12}
          label="MyDrive"
          fontSize={14}
        />

        {[
          [SEM_YS[0], "Sem1"],
          [SEM_YS[1], "Sem2"],
          [SEM_YS[2], "Sem3"],
          [SEM_YS[3], "Sem(n)"],
        ].map(([cy, label]) => (
          <Node key={label} cx={CX_SEM} cy={cy} label={label} />
        ))}
        <text
          x={CX_SEM}
          y={DOTS_Y}
          textAnchor="middle"
          fontSize="18"
          fill={dimDot}
        >
          ···
        </text>

        {[
          [SUB_YS[0], "Sub_1 Name"],
          [SUB_YS[1], "Sub_2 Name"],
          [SUB_YS[2], "Sub_3 Name"],
          [SUB_YS[3], "Sub_n Name"],
        ].map(([cy, label]) => (
          <Node
            key={label}
            cx={CX_SUB}
            cy={cy}
            w={108}
            label={label}
            fontSize={12}
          />
        ))}
        <text
          x={CX_SUB}
          y={DOTS_Y}
          textAnchor="middle"
          fontSize="18"
          fill={dimDot}
        >
          ···
        </text>

        {/* NoteShare */}
        <rect
          x={NOTE_LX}
          y={NOTE_SHARE_CY - NOTE_SHARE_H / 2}
          width={152}
          height={NOTE_SHARE_H}
          rx="9"
          fill={nodeFill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        <text
          x={CX_NOTE}
          y={NOTE_SHARE_CY - 7}
          textAnchor="middle"
          fontSize="11.5"
          fill={textMain}
        >
          Share your files in
        </text>
        <text
          x={CX_NOTE}
          y={NOTE_SHARE_CY + 9}
          textAnchor="middle"
          fontSize="11.5"
          fill={textMain}
        >
          Subject folder
        </text>

        {/* NoteMore */}
        <rect
          x={NOTE_LX}
          y={NOTE_MORE_CY - NOTE_MORE_H / 2}
          width={152}
          height={NOTE_MORE_H}
          rx="9"
          fill={nodeFill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        <text
          x={CX_NOTE}
          y={NOTE_MORE_CY - 14}
          textAnchor="middle"
          fontSize="11"
          fill={textMain}
        >
          You can make more
        </text>
        <text
          x={CX_NOTE}
          y={NOTE_MORE_CY + 2}
          textAnchor="middle"
          fontSize="11"
          fill={textMain}
        >
          folders here e.g.
        </text>
        <text
          x={CX_NOTE}
          y={NOTE_MORE_CY + 17}
          textAnchor="middle"
          fontSize="11"
          fill={textMain}
        >
          Unit folder
        </text>

        {/* ── BOTTOM LABELS ─────────────────────────────────────────── */}

        {/* Your Main Folder */}
        <rect
          x={CX_MY - 65}
          y={LABEL_TOP}
          width={130}
          height={LABEL_H}
          rx="8"
          fill={blueFill}
        />
        <text
          x={CX_MY}
          y={LABEL_CY + 5}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill={blueText}
        >
          Your Main Folder
        </text>

        {/* Sem Folder */}
        <rect
          x={CX_SEM - 55}
          y={LABEL_TOP}
          width={110}
          height={LABEL_H}
          rx="8"
          fill={blueFill}
        />
        <text
          x={CX_SEM}
          y={LABEL_CY + 5}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill={blueText}
        >
          Sem Folder
        </text>

        {/* Subject Folder */}
        <rect
          x={CX_SUB - 57}
          y={LABEL_TOP}
          width={114}
          height={LABEL_H}
          rx="8"
          fill={blueFill}
        />
        <text
          x={CX_SUB}
          y={LABEL_CY + 5}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill={blueText}
        >
          Subject Folder
        </text>

        {/* You can also share this folder link */}
        <rect
          x={CX_NOTE - 73}
          y={LABEL_TOP - 7}
          width={146}
          height={50}
          rx="8"
          fill="transparent"
          stroke={greenBorder}
          strokeWidth="1.5"
          strokeDasharray="6,3"
        />
        <text
          x={CX_NOTE}
          y={LABEL_CY - 2}
          textAnchor="middle"
          fontSize="11"
          fill={greenText}
        >
          You can also share
        </text>
        <text
          x={CX_NOTE}
          y={LABEL_CY + 13}
          textAnchor="middle"
          fontSize="11"
          fill={greenText}
        >
          this folder link
        </text>

        {/* Always share this folder link */}
        <rect
          x={CX_SUB - 67}
          y={ALWAYS_TOP}
          width={134}
          height={ALWAYS_H}
          rx="8"
          fill="transparent"
          stroke={greenBorder}
          strokeWidth="1.5"
          strokeDasharray="6,3"
        />
        <text
          x={CX_SUB}
          y={ALWAYS_CY - 5}
          textAnchor="middle"
          fontSize="11"
          fill={greenText}
        >
          Always share this
        </text>
        <text
          x={CX_SUB}
          y={ALWAYS_CY + 11}
          textAnchor="middle"
          fontSize="11"
          fill={greenText}
        >
          folder link
        </text>
      </svg>
    </div>
  );
}
