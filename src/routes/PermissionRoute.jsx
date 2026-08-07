import React from 'react'
import { Navigate } from 'react-router-dom'
import { usePermission } from '../hooks/UsePermission'
import { MENU } from '../data/Menu'

const routeFallbacks = [
    { typeId: MENU.DASHBOARD, path: '/admin/dashboard' },
    { typeId: MENU.ACTIVITY, path: '/admin/activity/view' },
    { typeId: MENU.EVENT, path: '/admin/events/view' },
    { typeId: MENU.END_USER, path: '/admin/manage-end-user' },
    { typeId: MENU.MESSAGE, path: '/admin/messages' },
    { typeId: MENU.REPORT, path: '/admin/reported-user' },
    { typeId: MENU.ROLE, path: '/admin/role-and-permission/view' },
    { typeId: MENU.VENUE, path: '/admin/venues/list' },
    { typeId: MENU.SUPPORT, path: '/admin/support-tickets' },
    { typeId: MENU.GROUP, path: '/admin/groups' },
    { typeId: MENU.BADGE, path: '/admin/manage-badges' },
    { typeId: MENU.PROHIBITED_WORD, path: '/admin/masters/prohibited-words' },
    { typeId: MENU.MANUFACTURER, path: '/admin/masters/manufacturer' },
    { typeId: MENU.ACCESSORY, path: '/admin/masters/accessories' },
    { typeId: MENU.GUN_MASTER, path: '/admin/masters/gun' },
    { typeId: MENU.AMMUNITION, path: '/admin/masters/ammunition' },
    { typeId: MENU.GUN_CATEGORY_MASTER, path: '/admin/masters/category' },
    { typeId: MENU.LEADERBOARD, path: '/admin/leaderboard' },
]

export default function PermissionRoute({ typeId, children }) {
    console.log(typeId);
    
    const permissions = usePermission() || []
    const hasAccess = permissions.some((permission) => permission.typeId === typeId && permission.canRead)
    console.log(hasAccess);
    
    if (hasAccess) {
        return children
    }

    const fallback = routeFallbacks.find((route) =>
        permissions.some((permission) => permission.typeId === route.typeId && permission.canRead)
    )?.path

    return <Navigate to={fallback ?? '/'} replace />
}
