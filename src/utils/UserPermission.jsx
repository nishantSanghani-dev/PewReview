import { MENU } from "../data/Menu";
import { usePermission } from "../hooks/UsePermission";

export default function useUserPermission() {
    const permissions = usePermission();
    return {
        dashboardPermission: permissions.find(
            (item) => item.menuId === MENU.DASHBOARD
        ),
        activityPermission: permissions.find(
            (item) => item.menuId === MENU.ACTIVITY
        ),
        groupPermission: permissions.find(
            (item) => item.menuId === MENU.GROUP
        ),
        eventPermission: permissions.find(
            (item) => item.menuId === MENU.EVENT
        ),
        venuePermission: permissions.find(
            (item) => item.menuId === MENU.VENUE
        ),
        rolePermission: permissions.find(
            (item) => item.menuId === MENU.ROLE
        ),
        userPermission: permissions.find(
            (item) => item.menuId === MENU.USER
        ),
        endUserPermission: permissions.find(
            (item) => item.menuId === MENU.END_USER
        ),
        supportPermission: permissions.find(
            (item) => item.menuId === MENU.SUPPORT
        ),
        messagePermission: permissions.find(
            (item) => item.menuId === MENU.MESSAGE
        ),
        reportPermission: permissions.find(
            (item) => item.menuId === MENU.REPORT
        ),
        leaderboardPermission: permissions.find(
            (item) => item.menuId === MENU.LEADERBOARD
        ),
        badgePermission: permissions.find(
            (item) => item.menuId === MENU.BADGE
        ),
        prohibitedWordPermission: permissions.find(
            (item) => item.menuId === MENU.PROHIBITED_WORD
        ),
        gunMasterPermission: permissions.find(
            (item) => item.menuId === MENU.GUN_MASTER
        ),
        ammunitionPermission: permissions.find(
            (item) => item.menuId === MENU.AMMUNITION
        ),
        accessoryPermission: permissions.find(
            (item) => item.menuId === MENU.ACCESSORY
        ),
        gunCategoryMasterPermission: permissions.find(
            (item) => item.menuId === MENU.GUN_CATEGORY_MASTER
        ),
        manufacturerPermission: permissions.find(
            (item) => item.menuId === MENU.MANUFACTURER
        ),
    };
}