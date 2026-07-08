import {
  createContext,
  forwardRef,
  useContext,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

interface ChartConfig {
  [key: string]: {
    label?: string
    color?: string
    icon?: ReactNode
  }
}

const ChartContext = createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }
  return context
}

interface ChartContainerProps extends ComponentProps<'div'> {
  config: ChartConfig
  children: ReactNode
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, children, className, ...props }, ref) => {
    const cssVars = Object.entries(config).reduce(
      (acc, [key, value]) => {
        if (value.color) {
          acc[`--color-${key}`] = value.color
        }
        return acc
      },
      {} as Record<string, string>,
    )

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          className={cn('flex items-center justify-center', className)}
          style={cssVars as CSSProperties}
          {...props}
        >
          {children}
        </div>
      </ChartContext.Provider>
    )
  },
)
ChartContainer.displayName = 'ChartContainer'

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: Record<string, unknown>
    dataKey?: string
    color?: string
  }>
  label?: string
  hideLabel?: boolean
  indicator?: 'dot' | 'line' | 'dashed'
  labelFormatter?: (label: string) => string
  formatter?: (value: number, name: string) => string
}

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  indicator = 'dot',
  labelFormatter,
  formatter,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-neutral-200/80 dark:border-neutral-700/80 bg-white dark:bg-neutral-900 px-3 py-2 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] text-sm">
      {!hideLabel && label && (
        <p className="mb-1 text-xs font-medium text-neutral-500">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-0.5">
        {payload.map((entry, i) => {
          const key = entry.dataKey || entry.name
          const itemConfig = config[key as string]
          const color = itemConfig?.color || entry.color
          const displayValue = formatter ? formatter(entry.value, entry.name) : entry.value.toLocaleString()

          return (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                {indicator === 'dot' && (
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="text-neutral-600 dark:text-neutral-400">
                  {itemConfig?.label || entry.name}
                </span>
              </div>
              <span className="font-medium tabular-nums">{displayValue}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChartTooltip({
  cursor = true,
  content,
  ...props
}: ComponentProps<typeof import('recharts').Tooltip> & {
  content?: ReactNode
}) {
  return <import('recharts').Tooltip cursor={cursor} content={content as ReactNode} {...props} />
}

const ChartLegend = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'> & {
    payload?: Array<{
      value: string
      color?: string
      dataKey?: string
    }>
  }
>(({ className, payload, ...props }, ref) => {
  const { config } = useChart()

  if (!payload?.length) return null

  return (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-center justify-center gap-4 pt-2', className)}
      {...props}
    >
      {payload.map((entry, i) => {
        const itemConfig = config[entry.dataKey || entry.value]
        const color = itemConfig?.color || entry.color

        return (
          <div key={i} className="flex items-center gap-1.5 text-sm">
            <span
              className="h-3 w-3 rounded shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-neutral-500">{itemConfig?.label || entry.value}</span>
          </div>
        )
      })}
    </div>
  )
})
ChartLegend.displayName = 'ChartLegend'

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, useChart }
export type { ChartConfig }
