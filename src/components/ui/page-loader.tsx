import { useMemo } from 'react'
import { motion } from 'framer-motion'

// ── Floating particle ──
function Particle({
  index,
  total,
  color,
}: {
  index: number
  total: number
  color: string
}) {
  const angle = (index / total) * Math.PI * 2
  const radius = 60 + (index % 3) * 28
  const cx = Math.cos(angle) * radius
  const cy = Math.sin(angle) * radius
  const size = 2 + (index % 3) * 1.5
  const duration = 3 + index * 0.4

  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        boxShadow: `0 0 ${size * 4}px currentColor`,
      }}
      animate={{
        x: [cx, cx + (index % 2 === 0 ? 12 : -12), cx],
        y: [cy, cy - (index % 2 === 0 ? 14 : -10), cy],
        opacity: [0.15, 0.7, 0.15],
        scale: [0.6, 1.3, 0.6],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.3,
      }}
    />
  )
}

// ── Growing ripple ring ──
function RippleRing({ delay, duration, fromColor }: {
  delay: number
  duration: number
  fromColor: string
}) {
  return (
    <motion.div
      className={`absolute rounded-full border ${fromColor} left-1/2 top-1/2`}
      style={{
        width: 0,
        height: 0,
        marginLeft: 0,
        marginTop: 0,
      }}
      animate={{
        width: [40, 180],
        height: [40, 180],
        marginLeft: [-20, -90],
        marginTop: [-20, -90],
        opacity: [0.5, 0],
        borderWidth: [2, 0.5],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeOut',
        delay,
      }}
    />
  )
}

// ── Main Loader ──
export function PageLoader() {
  const particles = useMemo(() => {
    const colors = [
      'bg-primary-400',
      'bg-accent-400',
      'bg-primary-300',
      'bg-cyan-400',
      'bg-violet-400',
      'bg-accent-300',
      'bg-primary-400',
      'bg-sky-400',
    ]
    return Array.from({ length: 12 }, (_, i) => ({
      key: i,
      color: colors[i % colors.length],
    }))
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 select-none">
      {/* ── Orb & Rings Container ── */}
      <div className="relative flex items-center justify-center w-[200px] h-[200px]">
        {/* ── SVG orbit rings & arcs ── */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary gradient stroke */}
            <linearGradient id="strokePrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary-400)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--color-accent-400)" stopOpacity="0.4" />
            </linearGradient>
            {/* Secondary gradient stroke */}
            <linearGradient id="strokeAccent" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent-400)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="var(--color-primary-300)" stopOpacity="0.3" />
            </linearGradient>
            {/* Soft glow blur */}
            <filter id="glowBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Arc 1 — thick partial ring, slow rotate */}
          <g className="animate-[aurora-spin_12s_linear_infinite]" style={{ transformOrigin: '100px 100px' }}>
            <circle
              cx="100" cy="100" r="74"
              stroke="url(#strokePrimary)"
              strokeWidth="1.2"
              strokeDasharray="180 280"
              strokeLinecap="round"
              fill="none"
              filter="url(#glowBlur)"
              opacity="0.6"
            />
          </g>

          {/* Arc 2 — thinner, reverse rotate, offset */}
          <g className="animate-[aurora-spin-reverse_9s_linear_infinite]" style={{ transformOrigin: '100px 100px' }}>
            <circle
              cx="100" cy="100" r="68"
              stroke="url(#strokeAccent)"
              strokeWidth="0.8"
              strokeDasharray="120 340"
              strokeLinecap="round"
              fill="none"
              filter="url(#glowBlur)"
              opacity="0.5"
            />
          </g>

          {/* Ring 1 — complete dashed orbit */}
          <g className="animate-[aurora-spin_15s_linear_infinite]" style={{ transformOrigin: '100px 100px' }}>
            <circle
              cx="100" cy="100" r="58"
              stroke="var(--color-primary-400)"
              strokeWidth="0.5"
              strokeDasharray="4 12"
              fill="none"
              opacity="0.35"
            />
            {/* Orbiting dot */}
            <circle
              cx="100" cy="42" r="2"
              fill="var(--color-primary-400)"
              filter="url(#glowBlur)"
            />
          </g>

          {/* Ring 2 — dashed, offset angle via transform */}
          <g
            className="animate-[aurora-spin-reverse_11s_linear_infinite]"
            style={{ transformOrigin: '100px 100px', transform: 'rotate(45deg)' }}
          >
            <circle
              cx="100" cy="100" r="64"
              stroke="var(--color-accent-400)"
              strokeWidth="0.5"
              strokeDasharray="3 16"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="100" cy="36" r="1.5"
              fill="var(--color-accent-400)"
              filter="url(#glowBlur)"
            />
          </g>
        </svg>

        {/* ── Nebula glow layers ── */}
        {/* Layer 1: largest, softest */}
        <motion.div
          className="absolute rounded-full animate-[halo-breathe-slow_4s_ease-in-out_infinite]"
          style={{
            width: 180, height: 180,
            background: 'radial-gradient(circle, var(--color-primary-400) 0%, transparent 60%)',
            opacity: 0.12,
            filter: 'blur(24px)',
          }}
        />
        {/* Layer 2: medium, accent color */}
        <motion.div
          className="absolute rounded-full animate-[halo-breathe_3s_ease-in-out_infinite]"
          style={{
            width: 140, height: 140,
            background: 'radial-gradient(circle, var(--color-accent-400) 0%, transparent 55%)',
            opacity: 0.15,
            filter: 'blur(20px)',
          }}
        />
        {/* Layer 3: inner bright glow */}
        <motion.div
          className="absolute rounded-full animate-[halo-breathe_2.5s_ease-in-out_infinite]"
          style={{
            width: 90, height: 90,
            background: 'radial-gradient(circle, var(--color-primary-300) 0%, var(--color-primary-500) 40%, transparent 70%)',
            opacity: 0.3,
            filter: 'blur(12px)',
          }}
        />

        {/* ── Expanding ripple rings ── */}
        <RippleRing delay={0} duration={3} fromColor="border-primary-400/30" />
        <RippleRing delay={1.5} duration={3} fromColor="border-accent-400/20" />

        {/* ── Floating particles ── */}
        {particles.map((p) => (
          <Particle key={p.key} index={p.key} total={particles.length} color={p.color} />
        ))}

        {/* ── Core orb ── */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 44, height: 44,
            background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), var(--color-primary-400) 35%, var(--color-primary-600) 70%, var(--color-primary-800))`,
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Core specular highlight */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 12, height: 6,
            background: 'rgba(255,255,255,0.7)',
            filter: 'blur(2px)',
            transform: 'translate(-8px, -8px)',
          }}
        />
      </div>

      {/* ── Text section ── */}
      <motion.div
        className="flex flex-col items-center gap-3 mt-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span
          className="text-sm font-medium tracking-[0.25em] uppercase"
          style={{
            background: 'linear-gradient(90deg, var(--color-neutral-400), var(--color-primary-400), var(--color-accent-400), var(--color-neutral-400))',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmer-text 2s ease-in-out infinite',
          }}
        >
          加载中
        </span>
      </motion.div>
    </div>
  )
}
