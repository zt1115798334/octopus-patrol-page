import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Plus, RefreshCw, Pencil, Trash2, ChevronRight, ChevronDown, Folders } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { findMenuList, saveMenu, deleteMenu } from '@/api/modules/menu'
import { toast } from 'sonner'
import type { MenuDto } from '@/types'

function MenuTreeItem({
  menu,
  level = 0,
  onEdit,
  onDelete,
}: {
  menu: MenuDto
  level?: number
  onEdit: (menu: MenuDto) => void
  onDelete: (menu: MenuDto) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = menu.children && menu.children.length > 0

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 group cursor-pointer"
        style={{ paddingLeft: 16 + level * 24 }}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="p-0.5">
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <Folders className="h-4 w-4 text-neutral-400" />
        <span className="text-sm font-medium flex-1">{menu.name || menu.path}</span>
        <span className="text-xs text-neutral-400 font-mono">{menu.path}</span>
        <div className="hidden group-hover:flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(menu)}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-danger-500"
            onClick={() => onDelete(menu)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {hasChildren && expanded && (
        <div>
          {menu.children!.map((child) => (
            <MenuTreeItem
              key={child.id || child.path}
              menu={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MenuManagement() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuDto | null>(null)
  const [formData, setFormData] = useState<Partial<MenuDto>>({})

  const { data, isLoading } = useQuery({ queryKey: ['menus'], queryFn: findMenuList })
  const menus = data?.data || []

  const saveMutation = useMutation({
    mutationFn: saveMenu,
    onSuccess: () => {
      toast.success(t('common.operationSuccess'))
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      setDialogOpen(false)
      setEditingMenu(null)
    },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      toast.success(t('common.operationSuccess'))
      queryClient.invalidateQueries({ queryKey: ['menus'] })
    },
    onError: () => toast.error(t('common.operationFailed')),
  })

  const openCreate = () => {
    setEditingMenu(null)
    setFormData({ name: '', path: '', parentId: undefined, sort: 0 })
    setDialogOpen(true)
  }

  const openEdit = (menu: MenuDto) => {
    setEditingMenu(menu)
    setFormData({ ...menu })
    setDialogOpen(true)
  }

  const handleSave = () => {
    saveMutation.mutate(formData as MenuDto)
  }

  const handleDelete = (menu: MenuDto) => {
    if (menu.id) {
      if (confirm(t('common.confirmDelete') + ' ' + (menu.name || menu.path) + '?')) {
        deleteMutation.mutate(menu.id)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {t('menu.title')}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {t('common.total', { total: menus.length })}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          {t('common.create')}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['menus'] })}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.refresh')}
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : menus.length === 0 ? (
            <EmptyState />
          ) : (
            menus.map((menu) => (
              <MenuTreeItem
                key={menu.id || menu.path}
                menu={menu}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMenu ? t('common.edit') : t('common.create')} {t('menu.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              label={t('menu.name')}
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label={t('menu.path')}
              value={formData.path || ''}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            />
            <Input
              label={t('menu.component')}
              value={formData.component || ''}
              onChange={(e) => setFormData({ ...formData, component: e.target.value })}
            />
            <Input
              label={t('menu.sort')}
              type="number"
              value={formData.sort?.toString() || '0'}
              onChange={(e) => setFormData({ ...formData, sort: Number(e.target.value) })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} loading={saveMutation.isPending}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
