import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Spinner from 'react-spinner-material';
import { Button } from "@/components/ui/button";
import { APIURL } from '../../lib/ApiKey';
import { FaFacebook, FaInstagram, FaTiktok, FaSnapchat, FaYoutube } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from "react-icons/fa";
import { HiLanguage } from "react-icons/hi2";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import callWaiterSvg from "@/Theme01/MenuItems/callWaiter.svg"

import Logo from '@/Theme01/MenuItems/waiter-svgrepo-com.svg';
import { useMenu } from '../../hooks/useMenu';
export default function Info({ items, infoRes, customization }) {
    const {
        submitBille,
        callWaiter,
    } = useMenu();
    const { t, i18n } = useTranslation("global");
    const [selectedLanguageCode, setSelectedLanguageCode] = useState(infoRes.language);
    const [isOpen, setIsOpen] = useState(false)
    const isArabic = infoRes.language === 'ar';
    const direction = isArabic ? 'rtl' : 'ltr';
    const languageMap = {
        en: "English",
        fr: "French",
        es: "Spanish",
        it: "Italian",
        ar: "العربية"
    };
    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);
        setSelectedLanguageCode(languageCode);
        setIsOpen(false)
    };
    if (!infoRes) {
        return (
            <div className='justify-center items-center flex h-screen'>
                <Spinner size={100} spinnerColor={"#28509E"} spinnerWidth={1} visible={true} style={{ borderColor: "#28509E", borderWidth: 2 }} />
            </div>
        );
    }

    const socialMediaLinks = [
        { icon: FaFacebook, link: infoRes.facebook },
        { icon: FaInstagram, link: infoRes.instgram },
        { icon: FaTiktok, link: infoRes.tiktok },
        { icon: FaSnapchat, link: infoRes.snapshat },
        { icon: FaYoutube, link: infoRes.youtube },
    ].filter(item => item.link);

    return (
        <>
            <div className={`flex flex-col items-center justify-center h-screen p-6 ${direction === 'rtl' ? 'text-right' : 'text-left'}`} dir={direction}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md p-8">
                    <div className="flex flex-col items-center">
                        <img
                            alt="Restaurant Logo"
                            className="rounded-full mb-4"
                            height={80}
                            src={`${APIURL}/storage/${infoRes.logo}`}
                            style={{ aspectRatio: "80/80", objectFit: "cover" }}
                            width={80}
                        />
                        <h1 className="text-2xl font-bold mb-2">{items.name}</h1>
                        <div className={`flex flex-wrap justify-center mb-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            {socialMediaLinks.map((item, index) => (
                                <div key={index} className="w-10 h-10 rounded-full border border-1 border-grey/50 grid text-[#28509E] place-content-center mx-2 mb-2">
                                    <Link to={item.link} target="_blank">
                                        <item.icon size={25} color={customization?.selectedIconColor} style={{ mixBlendMode: 'difference' }} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 w-full mb-3">
                            <h2 className="text-lg font-bold mb-2">{t("info.WiFiPassword")}</h2>
                            <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{infoRes.wifi_pass}</span>
                                <div className="flex space-x-2">
                                    <Button className="rounded-full" size="icon" variant="ghost" onClick={() => navigator.clipboard.writeText(infoRes.wifi_pass)}>
                                        <CopyIcon className="w-5 h-5" />
                                        <span className="sr-only">Copy WiFi Password</span>
                                    </Button>
                                </div>

                            </div>

                        </div>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>

                            <DialogTrigger asChild >
                                <div className="bg-gray-100 flex items-center gap-2 justify-around dark:bg-gray-700 rounded-lg p-4 w-full mb-6"
                                >
                                    <div >
                                        <HiLanguage className='w-6 h-6' />

                                    </div>
                                    <h2 className="text-md flex-1 font-normal ">{t("info.changeLanguage")}</h2>
                                    <FaChevronRight className='' />

                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-[80%] gap-0 px-[20px] py-[23px] rounded-lg">
                                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <DialogTitle className="text-lg tracking-wide font-bold text-gray-700">Select Language</DialogTitle>
                                </DialogHeader>

                                <Card className="w-full max-w-md border-none mx-auto">
                                    <ul className="divide-y">
                                        {Object.keys(languageMap).map((code) => (
                                            <li key={code}>
                                                <button
                                                    className={`flex items-center justify-between w-full px-4 py-4 text-md font-medium text-left hover:bg-muted/50 transition-colors ${selectedLanguageCode === code ? 'text-[' + customization?.selectedPrimaryColor + ']' : 'text-muted-foreground'}`}
                                                    onClick={() => handleLanguageChange(code)}
                                                >
                                                    {languageMap[code]}
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                            </DialogContent>
                        </Dialog>


                        <div className={`flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <PhoneIcon className="w-5 h-5" />
                            <span>+ {infoRes.phone}</span>
                        </div>
                        <div className={`flex items-center text-center space-x-2 text-gray-700 dark:text-gray-300 mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <span>{t("info.Address")}: {infoRes.address}</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-500 text-center dark:text-gray-400 px-2">{infoRes.description}</p>
                        </div>
                    </div>
                    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400 pt-4 justify-center text-center"> © {new Date().getFullYear()} <a href="https://www.garista.com/" class="hover:underline"> {t("info.powered")}</a> </span>

                </div>

            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild className={`mb-1 fixed bottom-16 right-2 md:right-[25%] lg:right-[32%] xl:right-[35%] flex-col flex items-end justify-center `}>
                    <Button className="h-16 w-16 rounded-full  shadow-lg flex items-center justify-center" size="icon" style={{ backgroundColor: customization?.selectedPrimaryColor }}>
                        <img src={Logo} alt="Waiter Icon" className="h-12 w-11" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[80%] md:w-full mx-auto rounded-lg">

                    <AlertDialogHeader className={`${infoRes.language === 'ar' ? ' ml-auto' : ''}`} dir={infoRes.language === 'ar' ? 'rtl' : 'ltr'}>
                        <img src={callWaiterSvg} alt="Call Waiter" />
                        {/* <AlertDialogTitle>{t("waiter.CallWaiter")}</AlertDialogTitle> */}
                        <AlertDialogTitle>{t("waiter.CallWaiter")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("waiter.please")}</AlertDialogDescription>

                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex !flex-col !justify-center  w-full gap-2'>

                        <AlertDialogAction className="w-full !px-0  " style={{ backgroundColor: customization?.selectedPrimaryColor }} onClick={callWaiter}>{t("waiter.CallWaiter")}</AlertDialogAction>
                        <AlertDialogAction variant="outline" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full  bg-white text-black !ml-0" style={{ borderColor: customization?.selectedPrimaryColor }} onClick={submitBille}>{t("waiter.BringTheBill")}</AlertDialogAction>
                        <AlertDialogCancel className="absolute top-1 right-2 rounded-full border-none">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-x"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function CopyIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"

        >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    )
}

function PhoneIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    )
}
