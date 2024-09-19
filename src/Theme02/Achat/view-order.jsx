"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
// import Image from "next/image"

import { Button } from "@/components/ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { axiosInstance } from "../../axiosInstance"
import { APIURL, APIURLS3 } from "../../lib/ApiKey"
import { useMenu } from "../../hooks/useMenu"
import { useTranslation } from "react-i18next"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
export default function ViewOrder({ orderID }) {
    const [orderDetails, setOrderDetails] = useState(null);
    const [isOpen, setIsOpen] = useState(false)
    const [t, i18n] = useTranslation("global");


    const { customization, resInfo } = useMenu();
    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await axiosInstance.get(`/api/order/${orderId}`);
            setOrderDetails(response.data);
        } catch (error) {
            console.error("Failed to fetch order details:", error);
            setOrderDetails(null);
        }
    };
    useEffect(() => {
        if (orderID) {
            fetchOrderDetails(orderID);
        }
    }, [orderID]);

    if (!orderDetails) {
        return null;
    }
    const DEFAULT_THEME = {
        id: 4,
        selectedBgColor: "#fff",
        selectedHeader: "logo-header",
        selectedLayout: "theme-grid",
        selectedPrimaryColor: "#000",
        selectedSecondaryColor: "#6B7280",
        selectedTheme: 1,
        selectedTextColor: "#fff",
        selectedIconColor: "#fff",
        isDefault: true,
      };
      const formattedTotalCost = new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(orderDetails.order.total);
    
    // Replace commas with spaces to match your desired format
    const formattedTotalCostWithSpaces = formattedTotalCost.replace(/,/g, ' ');
    
      console.log("im cart ", orderDetails);
    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button className="self-end text-white px-2 mr-[6px] mb-2" style={{ backgroundColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }}>
                    {t("achat.see")}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-w-full  gap-0 px-[20px] py-[23px] rounded-lg">
                <DrawerHeader className="flex mt-6 flex-row items-center justify-between space-y-0 pb-2">
                    <DrawerTitle className="text-2xl tracking-wide font-bold text-gray-700">
                        {t("achat.Order")}: <span className="text-[#7D7D7D] tracking-tight text-lg font-medium">#{orderDetails.order.id}</span>
                    </DrawerTitle>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close</span>
                    </Button>
                </DrawerHeader>
                <ScrollArea className="max-h-[300px] pr-4 mt-4 overflow-y-auto">
                    {orderDetails.dishes.map((item) => (
                        <div key={item.id} className="flex items-center space-x-1 mb-4">

                            <div className="flex-1 self-baseline mt-2">
                                <h3 className="text-sm font-bold text-gray-700">{item.name}</h3>
                                <p className="text-sm mt-1 text-gray-500">{item.price} {resInfo.currency}</p>
                            </div>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full text-black text-md font-medium">
                                x{item.quantity}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
                <Separator className="my-4" />
                <div className={`flex justify-between rounded-lg p-3 bg-muted/50 items-center`} >
                    <h3 className="text-md font-semibold text-[#024CA3]" style={{ color: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }}>{t("achat.total")}</h3>
                    <p className="text-md font-bold " style={{ color: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }}>{formattedTotalCostWithSpaces} {resInfo.currency}</p>
                </div>

            </DrawerContent>
        </Drawer>
    )
}