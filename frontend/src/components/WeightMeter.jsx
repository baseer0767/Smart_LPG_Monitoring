import { useState, useEffect } from "react";

export default function WeightMeter({ weight_in }) {
  const [displayWeight, setDisplayWeight] = useState(0);

  const MAX_WEIGHT = 100; // meter goes up to 100
  const STEP = 20; // gap between labels
  const weight = Math.max(0, Math.min(100, weight_in));

  // Smooth transition
  useEffect(() => {
    let step = (weight - displayWeight) / 20;
    let frame = 0;
    const smooth = setInterval(() => {
      frame++;
      setDisplayWeight((prev) => Math.round(prev + step));
      if (frame >= 20) clearInterval(smooth);
    }, 50);
  }, [weight]);

  // Gauge math
  const radius = 110;
  const startAngle = -180;
  const endAngle = 0;
  const progress = Math.min(displayWeight / MAX_WEIGHT, 1);
  const angle = startAngle + (endAngle - startAngle) * progress;

  const cx = 150;
  const cy = 140;
  const needleLength = 90;
  const needleX = cx + needleLength * Math.cos((Math.PI * angle) / 180);
  const needleY = cy + needleLength * Math.sin((Math.PI * angle) / 180);

  // Generate ticks with clean steps
  const ticks = [];
  for (let val = 0; val <= MAX_WEIGHT; val += STEP) {
    const tickProgress = val / MAX_WEIGHT;
    const tickAngle = startAngle + (endAngle - startAngle) * tickProgress;

    const x1 = cx + (radius - 10) * Math.cos((Math.PI * tickAngle) / 180);
    const y1 = cy + (radius - 10) * Math.sin((Math.PI * tickAngle) / 180);

    const x2 = cx + (radius + 5) * Math.cos((Math.PI * tickAngle) / 180);
    const y2 = cy + (radius + 5) * Math.sin((Math.PI * tickAngle) / 180);

    const lx = cx + (radius + 25) * Math.cos((Math.PI * tickAngle) / 180);
    const ly = cy + (radius + 25) * Math.sin((Math.PI * tickAngle) / 180);

    ticks.push(
      <g key={val}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="3" />
        <text
          x={lx}
          y={ly}
          fill="black"
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {val}
        </text>
      </g>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <svg width="250" height="150" viewBox="0 0 300 180">
        {/* Arc background */}
        <path
          d="M 40 140 A 110 110 0 0 1 260 140"
          fill="none"
          stroke="#3D3D3D"
          strokeWidth="20"
          opacity="1"
        />

        {/* Ticks + labels */}
        {ticks}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="red"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="6" fill="black" />
      </svg>

      {/* Current value */}
    </div>
  );
}
