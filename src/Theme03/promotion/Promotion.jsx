import React, { useEffect, useState } from 'react';
import { APIURL, APIURLS3 } from '../../lib/ApiKey';

function PromoComponent  ({ promo })  {
  const [currentIndex, setCurrentIndex] = useState(0);


  const handleCircleClick = (index) => {
    setCurrentIndex(index);
  };


  return (
    <div className='my-4 w-full h-[160px]  relative'>
        <div className='w-[351px] h-[147px] mx-auto  relative '>
          <img 
            src={`${APIURLS3}/${promo[currentIndex].image}`}
            alt={`Promo ${promo[currentIndex].id}`} 
            className="h-full w-full object-cover rounded-lg" 
          />
            <button 
              className="absolute bottom-8 right-8 bg-[#EF8800] text-white py-1 px-3 rounded-full hover:bg-[red]"
            >
              Order Now
            </button>
        </div>
        <div className='w-full h-[40px] mt-2 flex items-center justify-center'>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  onClick={() => handleCircleClick(index)}
                  className={`relative flex items-center justify-center ${
                    currentIndex === index ? 'w-8 h-8' : 'w-6 h-6'
                  } mx-2`}
                >
                  
                  <div
                    className={`w-full h-full rounded-full ${
                      currentIndex === index ? 'border-2 border-[red]' : 'bg-[#EF8800]'
                    }`}
                  >
                    
                    {currentIndex === index && (
                      <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-[red] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </div>
                </div>
              ))}
          </div>
      </div>

      //  {promo.length > 0 && (
      //   <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 p-2">
      //     <p>ID: {promo[currentIndex].id}</p>
      //     <p>Prix: {promo[currentIndex].price} DH</p>
      //   </div>
      // )}
    
  );
};

export default PromoComponent;
