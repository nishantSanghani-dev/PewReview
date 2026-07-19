import { useContext } from "react"
import { loaderContext } from "../context/LoaderProvider"


export const useLoader = () => {
    const loader = useContext(loaderContext)
    return loader

}