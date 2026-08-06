import React from 'react'
import { Navigate } from 'react-router-dom'
import { usePermission } from '../hooks/UsePermission'
import { MENU } from '../data/Menu'

const routeFallbacks = [
    { menuId: MENU.DASHBOARD, path: '/admin/dashboard' },
    { menuId: MENU.ACTIVITY, path: '/admin/activity/view' },
    { menuId: MENU.EVENT, path: '/admin/events/view' },
    { menuId: MENU.END_USER, path: '/admin/manage-end-user' },
    { menuId: MENU.MESSAGE, path: '/admin/messages' },
    { menuId: MENU.REPORT, path: '/admin/reported-user' },
    { menuId: MENU.ROLE, path: '/admin/role-and-permission/view' },
    { menuId: MENU.VENUE, path: '/admin/venues/list' },
    { menuId: MENU.SUPPORT, path: '/admin/support-tickets' },
    { menuId: MENU.GROUP, path: '/admin/groups' },
    { menuId: MENU.BADGE, path: '/admin/manage-badges' },
    { menuId: MENU.PROHIBITED_WORD, path: '/admin/masters/prohibited-words' },
    { menuId: MENU.MANUFACTURER, path: '/admin/masters/manufacturer' },
    { menuId: MENU.ACCESSORY, path: '/admin/masters/accessories' },
    { menuId: MENU.GUN_MASTER, path: '/admin/masters/gun' },
    { menuId: MENU.AMMUNITION, path: '/admin/masters/ammunition' },
    { menuId: MENU.GUN_CATEGORY_MASTER, path: '/admin/masters/category' },
    { menuId: MENU.LEADERBOARD, path: '/admin/leaderboard' },
]

export default function PermissionRoute({ menuId, children }) {
    
    const permissions = usePermission() || []
    const hasAccess = permissions.some((permission) => permission.menuId === menuId && permission.canRead)

    if (hasAccess) {
        return children
    }

    const fallback = routeFallbacks.find((route) =>
        permissions.some((permission) => permission.menuId === route.menuId && permission.canRead)
    )?.path

    return <Navigate to={fallback ?? '/'} replace />
}
