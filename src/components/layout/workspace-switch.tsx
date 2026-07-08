import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Building2, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Workspace {
  id: string
  name: string
  icon?: string
  plan?: string
}

interface WorkspaceSwitchProps {
  workspaces?: Workspace[]
  currentWorkspace?: Workspace
  onSwitch?: (workspace: Workspace) => void
}

const defaultWorkspaces: Workspace[] = [
  { id: 'default', name: 'Default Workspace', plan: 'Free' },
  { id: 'team-a', name: 'Team Alpha', plan: 'Pro' },
  { id: 'team-b', name: 'Team Beta', plan: 'Enterprise' },
]

export function WorkspaceSwitch({
  workspaces = defaultWorkspaces,
  currentWorkspace = defaultWorkspaces[0],
  onSwitch,
}: WorkspaceSwitchProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(currentWorkspace)

  const handleSwitch = (workspace: Workspace) => {
    setActive(workspace)
    setOpen(false)
    onSwitch?.(workspace)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="h-8 gap-1.5 px-2 text-xs font-medium"
        onClick={() => setOpen(!open)}
      >
        <Building2 className="h-3.5 w-3.5 text-neutral-500" />
        <span className="max-w-[100px] truncate hidden lg:inline">{active.name}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-neutral-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-full mt-1 z-50 w-56"
            >
              <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white dark:bg-neutral-900 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)] p-1.5">
                <div className="px-2 py-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Workspaces
                  </p>
                </div>
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleSwitch(workspace)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-[10px] px-2 py-1.5 text-sm transition-colors duration-150',
                      active.id === workspace.id
                        ? 'bg-primary-50/80 dark:bg-primary-950/20 text-primary-700 dark:text-primary-300'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80',
                    )}
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary-500 to-accent-500 text-white text-[10px] font-bold">
                      {workspace.name.charAt(0)}
                    </div>
                    <span className="flex-1 text-left truncate">{workspace.name}</span>
                    {workspace.plan && (
                      <span className="text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded px-1.5 py-0.5">
                        {workspace.plan}
                      </span>
                    )}
                    {active.id === workspace.id && (
                      <Check className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                    )}
                  </button>
                ))}
                <div className="mt-1 border-t border-neutral-100/80 dark:border-neutral-800/80 pt-1">
                  <button
                    className="flex w-full items-center gap-2 rounded-[10px] px-2 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors duration-150"
                  >
                    <Plus className="h-4 w-4" />
                    Create Workspace
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
