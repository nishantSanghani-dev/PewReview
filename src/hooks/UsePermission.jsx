import { useSelector } from "react-redux"

export const usePermission = () => {
    const {permissions} = useSelector((store) => store.user)
    return permissions
    
}