// components/dashboard/PerformanceChart.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface PerformanceChartProps {
  examAttempts: any[]
}

export default function PerformanceChart({ examAttempts }: PerformanceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const pointsRef = useRef<Array<{x:number,y:number,data:any}>>([])
  const [tooltip, setTooltip] = useState<{x:number,y:number,html:string} | null>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const points = pointsRef.current
      if (!points || points.length === 0) return setTooltip(null)
      let nearest = null
      let minD = Infinity
      for (const p of points) {
        const dx = p.x - mx
        const dy = p.y - my
        const d = Math.sqrt(dx*dx + dy*dy)
        if (d < minD) { minD = d; nearest = p }
      }
      if (nearest && minD < 18) {
        const html = `${new Date(nearest.data.createdAt).toLocaleDateString()} — <strong>${nearest.data.percentage || 0}%</strong>`
        setTooltip({ x: nearest.x + rect.left, y: nearest.y + rect.top - 10, html })
      } else {
        setTooltip(null)
      }
    }
    const handleLeave = () => setTooltip(null)
    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('mouseleave', handleLeave)
    return () => {
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || examAttempts.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Responsive pixel ratio handling
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height

    ctx.clearRect(0, 0, width, height)

    // Prepare data (latest up to 8 points sorted by date)
    const points = [...examAttempts]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-8)

    const userSeries = points.map(p => p.percentage || 0)
    const classSeries = points.map(p => (p.classAverage != null ? p.classAverage : Math.min(100, (p.percentage || 0) + 5)))

    const padding = 20
    const plotWidth = width - padding * 2
    const plotHeight = height - padding * 2

    // Draw gridlines
    ctx.strokeStyle = '#eef2ff'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i / 4) * plotHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + plotWidth, y)
      ctx.stroke()
    }

    // Helper to map value to y
    const yFor = (val: number) => padding + (1 - val / 100) * plotHeight

    const stepX = plotWidth / Math.max(1, userSeries.length - 1)

    // Draw area for user series
    ctx.beginPath()
    userSeries.forEach((v, i) => {
      const x = padding + i * stepX
      const y = yFor(v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    // close to bottom
    ctx.lineTo(padding + plotWidth, padding + plotHeight)
    ctx.lineTo(padding, padding + plotHeight)
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, padding, 0, padding + plotHeight)
    grad.addColorStop(0, 'rgba(3, 105, 161, 0.18)')
    grad.addColorStop(1, 'rgba(3, 105, 161, 0.02)')
    ctx.fillStyle = grad
    ctx.fill()

    // Draw user line
    ctx.beginPath()
    ctx.lineWidth = 2.5
    ctx.strokeStyle = '#0369a1' // blue
    userSeries.forEach((v, i) => {
      const x = padding + i * stepX
      const y = yFor(v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Draw class line
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = '#10b981' // green
    ctx.setLineDash([6, 4])
    classSeries.forEach((v, i) => {
      const x = padding + i * stepX
      const y = yFor(v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Draw markers
    pointsRef.current = []
    userSeries.forEach((v, i) => {
      const x = padding + i * stepX
      const y = yFor(v)
      ctx.beginPath()
      ctx.fillStyle = '#0369a1'
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
      pointsRef.current.push({ x: x, y: y, data: points[i] })
    })

    // Labels (x-axis)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    points.forEach((p, i) => {
      const x = padding + i * stepX
      const label = new Date(p.createdAt).toLocaleString('default', { month: 'short' })
      ctx.fillText(label, x, padding + plotHeight + 14)
    })
  }, [examAttempts])

  useEffect(() => {
    if (!tooltip) return
    let el = tooltipRef.current
    if (!el) {
      el = document.createElement('div')
      el.style.position = 'fixed'
      el.style.pointerEvents = 'none'
      el.style.zIndex = '9999'
      el.className = 'rounded-lg px-3 py-2 text-sm bg-slate-800 text-white shadow'
      document.body.appendChild(el)
      tooltipRef.current = el
    }
    el.innerHTML = tooltip.html
    el.style.left = `${tooltip.x + 8}px`
    el.style.top = `${tooltip.y - 36}px`
  }, [tooltip])

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