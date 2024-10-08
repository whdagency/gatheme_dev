import React from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { APIURL, APIURLS3 } from '../../lib/ApiKey';

function PromoItem({ selectedTab, customization, promo }) {


  return (
    <>
      <div className='pt-4 mx-auto w-full' style={{ backgroundColor: customization?.selectedBgColor }}>


        <div className='overflow-x-auto md:max-w-[80%]  mx-auto px-3'>
          <h1 className='pb-2 text-lg text-black font-semibold' style={{ color: customization?.selectedTextColor }}>{selectedTab}</h1>
          {
            promo?.length > 0 && (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 mb-[100px] lg:mb-[150px]'>
                {
                  promo.map((item, index) => (
                    <div className="tabs-container overflow-x-auto">
                      <div className="flex gap-4">
                        <Button key={index} style={{ backgroundColor: !customization?.selectedBgColor, }} className="h-auto w-full !py-0 px-0 bg-transparent hover:bg-transparent">
                          <div className="relative shadow-md rounded-[10px] w-full border-gray-300 border inline-block">
                            <div
                              className="tab items-center justify-center h-full w-full overflow-hidden p-1.5 text-lg font-semibold rounded-[8px] cursor-pointer transition-colors"
                            >
                              <img
                                // src={`${APIURL}/storage/${item?.image}`}
                                src={`${APIURLS3}/${item?.image}`}

                                alt="Menu Icon" className="w-full object-cover rounded-[10px] h-32" />
                              <div className='text-black flex justify-between items-center py-2 px-3'>
                                <div>
                                  <h2 className="text-[12px] mb-0 text-left" style={{ color: customization?.selectedTextColor }}>{item?.title}</h2>
                                  <p className='text-[12px] text-left' style={{ color: customization?.selectedTextColor }}>{item?.price} MAD</p>
                                </div>
                                <button
                                  type="button"
                                  style={{ backgroundColor: customization?.selectedPrimaryColor }}
                                  className="text-white leading-0 w-[30px] h-[30px] flex items-center justify-center rounded-[8px]">
                                  <AiOutlinePlus style={{ color: "#ffffff" }} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  ))
                }

              </div>

            )
          }
        </div>

      </div>

    </>
  );
}

export default PromoItem;
