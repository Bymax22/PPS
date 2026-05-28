// components/dashboard/PerformanceChart.tsx
'use client'

import { useEffect, useRef } from 'react'

interface PerformanceChartProps {
  examAttempts: any[]
}

export default function PerformanceChart({ examAttempts }: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || examAttempts.length === 0) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height
    
    ctx.clearRect(0, 0, width, height)
    
    // Draw bars
    const barWidth = (width / examAttempts.length) * 0.6
    const spacing = (width / examAttempts.length) * 0.4
    
    examAttempts.slice(0, 6).forEach((attempt, i) => {
      const percentage = attempt.percentage || 0
      const barHeight = (percentage / 100) * height
      const x = i * (barWidth + spacing) + spacing / 2
      const y = height - barHeight
      
      ctx.fillStyle = attempt.isPassed ? '#0EF117' : '#003087'
      ctx.fillRect(x, y, barWidth, barHeight)
      
      // Draw label
      ctx.fillStyle = '#6b7280'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(attempt.exam.title.substring(0, 10), x + barWidth / 2, height - 5)
    })
  }, [examAttempts])

  if (examAttempts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Complete exams to see your performance chart</p>
      </div>
    )
  }

  return (
    <canvas 
      ref={canvasRef}
      width={600}
      height={200}
      className="w-full h-auto"
      style={{ maxHeight: '200px' }}
    />
  )
}