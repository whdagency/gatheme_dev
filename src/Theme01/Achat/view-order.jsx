"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
// import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { axiosInstance } from "../../axiosInstance"
import { APIURL } from "../../lib/ApiKey"
import { useMenu } from "../../hooks/useMenu"
import { useTranslation } from "react-i18next"


export default function ViewOrder({ orderID }) {
    const [orderDetails, setOrderDetails] = useState(null);
    const [isOpen, setIsOpen] = useState(false)
    const [t, i18n] = useTranslation("global");

    const { customization } = useMenu();
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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="self-end text-white px-2 mr-[6px] mb-2" style={{ backgroundColor: customization?.selectedPrimaryColor }}>
                    {t("achat.see")}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[80%] gap-0 px-[20px] py-[23px] rounded-lg">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <DialogTitle className="text-2xl tracking-wide font-bold text-gray-700">
                        {t("achat.Order")}: <span className="text-[#7D7D7D] tracking-tight text-lg font-medium">#{orderDetails.order.id}</span>
                    </DialogTitle>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close</span>
                    </Button>
                </DialogHeader>
                <ScrollArea className="h-[300px] pr-4 mt-4">
                    {orderDetails.dishes.map((item) => (
                        <div key={item.id} className="flex items-center space-x-1 mb-4">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                <img
                                    src={`${APIURL}/storage/${item.image}`}
                                    alt={item.name}
                                    className="rounded-md object-cover w-14 h-14"
                                />
                            </div>
                            <div className="flex-1 self-baseline mt-2">
                                <h3 className="text-sm font-bold text-gray-700">{item.name}</h3>
                                <p className="text-sm mt-1 text-gray-500">{item.price}</p>
                            </div>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full text-black text-md font-medium">
                                x{item.quantity}
                            </div>
                        </div>
                    ))}
                </ScrollArea>
                <Separator className="my-4" />
                <div className={`flex justify-between rounded-lg p-3 bg-muted/50 items-center`} >
                    <h3 className="text-md font-semibold text-[#024CA3]" style={{ color: customization?.selectedPrimaryColor }}>{t("achat.total")}</h3>
                    <p className="text-md font-bold " style={{ color: customization?.selectedPrimaryColor }}>{orderDetails.order.total} </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}