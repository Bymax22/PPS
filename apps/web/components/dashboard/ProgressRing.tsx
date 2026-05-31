"use client"

interface ProgressRingProps {
  size?: number
  stroke?: number
  percentage: number
  label?: string
}

export default function ProgressRing({ size = 120, stroke = 10, percentage, label }: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} className="block">
        <defs>
          <linearGradient id="ringGrad" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="#eef2ff"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="-mt-[86px] text-center">
        <p className="text-2xl font-bold text-slate-800">{percentage}%</p>
        {label && <p className="text-sm text-slate-500">{label}</p>}
      </div>
    </div>
  )
}
