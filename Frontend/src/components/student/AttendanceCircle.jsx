const CENTER = 50;
const RADIUS = 50;
const HOLE_RADIUS = 30;

const getColor = (status) => {
  switch (status) {
    case "PRESENT":
      return "#22c55e";
    case "LATE":
      return "#f59e0b";
    case "ABSENT":
      return "#ef4444";
    default:
      return "#cbd5e1";
  }
};

// angle measured clockwise from the top (12 o'clock = 0deg), matching the
// original hand-drawn quadrants this component replaced.
const polarToCartesian = (angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.sin(rad),
    y: CENTER - RADIUS * Math.cos(rad),
  };
};

const describeSlice = (startAngle, endAngle) => {
  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

/**
 * Renders one colored slice per period in `periods` — however many that is.
 * 0 periods = plain grey circle ("no class"), 1 = full colored circle,
 * 2+ = N equal pie slices going clockwise from the top.
 */
const AttendanceCircle = ({ periods = [] }) => {
  const count = periods.length;

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 100 100"
      className="group-hover:scale-110 text-white drop-shadow-sm transition-transform dark:text-slate-900"
    >
      {count === 0 && (
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={getColor(null)} />
      )}

      {count === 1 && (
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill={getColor(periods[0]?.status)}
          stroke="white"
          strokeWidth="2"
        />
      )}

      {count >= 2 &&
        periods.map((period, i) => {
          const sliceAngle = 360 / count;
          return (
            <path
              key={i}
              d={describeSlice(i * sliceAngle, (i + 1) * sliceAngle)}
              fill={getColor(period?.status)}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

      <circle cx={CENTER} cy={CENTER} r={HOLE_RADIUS} fill="currentColor" />
    </svg>
  );
};

export default AttendanceCircle;
