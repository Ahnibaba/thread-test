import { toaster } from "../components/ui/toaster"

const useShowToast = () => {

    const showToast = (title, type, description) => {
        toaster.create({
            title,
            type,
            description,
            duration: 3000
        })
    }
    return showToast
}

export default useShowToast