import { MENU } from '../data/Menu';
import { usePermission } from '../hooks/UsePermission';

export default function useUserPermission() {
  const permissions = usePermission();
  return {
    dashboardPermission: permissions.find(
      (item) => item.typeId === MENU.DASHBOARD
    ),
    activityPermission: permissions.find(
      (item) => item.typeId === MENU.ACTIVITY
    ),
    groupPermission: permissions.find((item) => item.typeId === MENU.GROUP),
    eventPermission: permissions.find((item) => item.typeId === MENU.EVENT),
    venuePermission: permissions.find((item) => item.typeId === MENU.VENUE),
    rolePermission: permissions.find((item) => item.typeId === MENU.ROLE),
    userPermission: permissions.find((item) => item.typeId === MENU.USER),
    endUserPermission: permissions.find(
      (item) => item.typeId === MENU.END_USER
    ),
    supportPermission: permissions.find((item) => item.typeId === MENU.SUPPORT),
    messagePermission: permissions.find((item) => item.typeId === MENU.MESSAGE),
    reportPermission: permissions.find((item) => item.typeId === MENU.REPORT),
    leaderboardPermission: permissions.find(
      (item) => item.typeId === MENU.LEADERBOARD
    ),
    badgePermission: permissions.find((item) => item.typeId === MENU.BADGE),
    prohibitedWordPermission: permissions.find(
      (item) => item.typeId === MENU.PROHIBITED_WORD
    ),
    gunMasterPermission: permissions.find(
      (item) => item.typeId === MENU.GUN_MASTER
    ),
    ammunitionPermission: permissions.find(
      (item) => item.typeId === MENU.AMMUNITION
    ),
    accessoryPermission: permissions.find(
      (item) => item.typeId === MENU.ACCESSORY
    ),
    gunCategoryMasterPermission: permissions.find(
      (item) => item.typeId === MENU.GUN_CATEGORY_MASTER
    ),
    manufacturerPermission: permissions.find(
      (item) => item.typeId === MENU.MANUFACTURER
    ),
  };
}
