import React, { useEffect, useState } from 'react';
import { FaFacebook, FaInstagram, FaSnapchat, FaTiktok, FaYoutube, } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { APIURL, APIURLS3 } from '../../lib/ApiKey';
import { axiosInstance } from '../../../axiosInstance';
import { useMenu } from '../../hooks/useMenu';
import { useTranslation } from 'react-i18next';
import { Avatar,  AvatarImage, AvatarFallback} from "@/components/ui/avatar"

function Banner({ items, infoRes }) {
    const {
        tableName
    } = useMenu();

    const [t, i18n] = useTranslation("global");

    return (
        <div className='pb-4 pt-0 px-0'>
            <div className="relative mx-auto h-[170px] md:h-[250px] md:max-w-[35rem] max-w-md  overflow-hidden rounded-b-lg bg-white shadow">
                <div className='overflow-hidden bg-[#999]'>
                
                       <Avatar className="max-h-44 md:max-h-[15rem]  h-screen w-full rounded-lg">
                        <AvatarImage
                        src={`${APIURLS3}/${infoRes.cover_image}`}
                        className="bg-white max-h-44 md:max-h-[15rem] w-full object-cover"
                        />
                        <AvatarFallback className="bg-slate-500 max-h-44 md:max-h-[15rem] h-screen w-full rounded-lg"></AvatarFallback>
                    </Avatar>
                </div>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black"></div>
                <div className="absolute inset-x-0 bottom-16 lg:bottom-20 z-20 p-4 text-center">
                    <h3 className="text-xl font-medium text-white">{items.name}</h3>
                </div>
                <div className='flex justify-between absolute inset-x-0 bottom-0 z-20 pb-4 text-center'>
                    <div className='flex gap-3 justify-center items-center pl-6 '>
                        {infoRes.facebook && (
                            <Link to={infoRes.facebook} target='_blank'>
                                <FaFacebook color='white' className='w-[19px] h-[19px]' />
                            </Link>
                        )}
                        {infoRes.instgram && (
                            <Link to={infoRes.instgram} target='_blank'>
                                <FaInstagram color='white' className='w-[19px] h-[19px]' />
                            </Link>
                        )}
                        {infoRes.snapshat && (
                            <Link to={infoRes.snapshat} target='_blank'>
                                <FaSnapchat color='white' className='w-[19px] h-[19px]' />
                            </Link>
                        )}
                        {infoRes.youtube && (
                            <Link to={infoRes.youtube} target='_blank'>
                                <FaYoutube color='white' className='w-[19px] h-[19px]' />
                            </Link>
                        )}
                        {infoRes.tiktok && (
                            <Link to={infoRes.tiktok} target='_blank'>
                                <FaTiktok color='white' className='w-[19px] h-[19px]' />
                            </Link>
                        )}
                    </div>
                    <div>
                        <p className='text-white pr-5'>{t("achat.table")} : {tableName}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Banner;