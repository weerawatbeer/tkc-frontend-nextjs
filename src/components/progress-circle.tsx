interface ProgressCircleProps {
  percentage: number
  size?: number
  strokeWidth?: number
  title: string
}

export default function ProgressCircle({
  percentage,
  size = 120,
  strokeWidth = 16,
  title,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex max-w-[220px] flex-col items-center">
      <svg
        className="rotate-[-90deg] transform"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          className="fill-none text-[#edeeff]"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring__circle fill-none text-[#7579FF]"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDashoffset: offset,
          }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="absolute origin-center rotate-90 fill-[#5F6073] text-2xl font-bold"
        >
          {percentage}%
        </text>
      </svg>
      <div className="mt-2 text-center">
        <h3 className="text-2xl font-normal text-[#1B1C37]">{title}</h3>
      </div>
    </div>
  )
}
