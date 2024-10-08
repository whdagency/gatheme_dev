import { useMenu } from "../../hooks/useMenu"
import { APIURL, APIURLS3 } from "../../lib/ApiKey";
import { motion } from "framer-motion";
import { Avatar,  AvatarImage, AvatarFallback} from "./avatar"

export default function SplashScreen() {
    const { resInfo, restos } = useMenu()
    const restaurantName = restos?.name || "Restaurant Name";
    const restaurantLogo = resInfo?.logo || "/default-logo.svg";

    return (
        <motion.div initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }} className="flex flex-col items-center justify-center overflow-hidden h-dvh bg-[#f8f9fa]">
            <div className="flex flex-col items-center justify-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* <img
                        // src={`${APIURL}/storage/${restaurantLogo}`}
                        src={`${APIURLS3}/${restaurantLogo}`}
                        loading='lazy'
                        className="w-48 object-cover rounded-full bg-[#999] h-48"
                        alt={"Restaurant Logo"}
                    /> */}
                    <Avatar className="h-48 w-48 rounded-full">
                        <AvatarImage
                        // src={`${APIURL}/storage/${ImageItem}`}
                        src={`${APIURLS3}/${restaurantLogo}`}
                        className="bg-white h-48 max-w-48  object-cover"
                        />
                        <AvatarFallback className="bg-slate-500 h-48 w-48 rounded-full"></AvatarFallback>
                    </Avatar>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-3xl font-bold text-[#2c3e50] text-center"
                >
                    {restaurantName}
                </motion.h1>
            </div>
            <div className="absolute bottom-6 flex items-center space-x-2 text-[#7f8c8d]">
                <span>Powered by <span className="font-bold text-xl">Garista.com</span></span>
            </div>
        </motion.div>
    )
}