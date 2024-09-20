import React, { useState } from 'react'
import {
    Credenza,
    CredenzaContent,
  } from "@/components/ui/credenza";
  import { FaRegStar, FaStar } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
  const StarRating = ({ rating, setRating }) => {
    const handleClick = (newRating) => {
      setRating(newRating);
    };
  
    return (
      <div className="flex justify-center items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
            <div onClick={() => handleClick(star)} className='cursor-pointer'>
                {
                    star <= rating
                    ?
                    <FaStar color='gold' size={35}/>
                    :
                    <FaRegStar color='gray' size={35}/>
                }
            </div>
        ))}
      </div>
    );
  };
const FeedBack = ({
    isModalOpen,
    setIsModalOpen,
    slug,
    table_id,
    hasTrustpilot,
    trustpilot_link,
    isTheme1 = true
}) => {
  const { setOpenClaimsModal  } = useMenu();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
    const handleSubmit = () => {
        if (rating <= 3) {
            if(isTheme1 == true)
            {
              navigate(`/menu/${slug}/Claims?table_id=${table_id}`); // Redirect to /Claims page
            }
            else{
              setIsModalOpen(false)
              setOpenClaimsModal(true)
            }
        } else if (hasTrustpilot) { // Check if hasTrustpilot is true and rating is more than 3
            window.location.href = trustpilot_link; // Redirect to Trustpilot
        } 
        else{
            setIsModalOpen(false)
        }
    };
  return (
    <Credenza className="!bg-white  !py-0" open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CredenzaContent className="flex h-[50%] md:max-h-[70%]  md:w-[50rem] bg-white md:flex-col md:justify-center md:items-center">
        <div className="mt-10 md:mt-0 mb-1 text-center text-lg font-semibold text-black">
            FeedBack
        </div>
        <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4 text-center">How satisfied are you?</h2>
            <StarRating rating={rating} setRating={setRating} />
            <div className="flex justify-center mt-5">
            <button
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-2 rounded-lg"
            >
                Submit
            </button>
            </div>
        </div>
        </CredenzaContent>
    </Credenza>
  )
}

export default FeedBack