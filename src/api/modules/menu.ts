import { get, post, del } from '@/lib/api-client'
import type { ResultMessage, MenuDto } from '@/types'

export function saveMenu(data: MenuDto): Promise<ResultMessage<MenuDto>> {
  return post<ResultMessage<MenuDto>>('/menu/saveMenu', data)
}

export function deleteMenu(id: number): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>(`/menu/deleteMenu/${id}`)
}

export function deleteMenus(ids: number[]): Promise<ResultMessage<void>> {
  return del<ResultMessage<void>>('/menu/deleteMenus', ids)
}

export function findMenuList(): Promise<ResultMessage<MenuDto[]>> {
  return get<ResultMessage<MenuDto[]>>('/menu/findMenuList')
}

export function findMenuButtonList(): Promise<ResultMessage<MenuDto[]>> {
  return get<ResultMessage<MenuDto[]>>('/menu/findMenuButtonList')
}

export function bindMenuPermissions(data: { menuId?: number; permissionIds?: number[] }): Promise<ResultMessage<void>> {
  return post<ResultMessage<void>>('/menu/bindMenuPermissions', data)
}
