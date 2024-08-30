import { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ViewOrder from './view-order';
import { Separator } from '@/components/ui/separator';
export default function StepsBar({ status, complete, orderID }) {
    const [showCompleteMessage, setShowCompleteMessage] = useState(false);

    useEffect(() => {
        if (status === 'Completed' && complete) {
            // Show the completion message after a 3-second delay
            const timer = setTimeout(() => setShowCompleteMessage(true), 3000);
            return () => clearTimeout(timer);
        } else {
            setShowCompleteMessage(false);
            complete = false;
        }
    }, [status, complete]);

    // Define the base steps
    const baseSteps = ['Preparing', 'Ready', 'Completed'];

    // Determine which steps to display based on the status
    const getSteps = () => {
        switch (status) {
            case 'Accepted':
                return ['Accepted', ...baseSteps];
            case 'Rejected':
                return ['Rejected', ...baseSteps];
            case 'Completed':
                return ['Accepted', ...baseSteps];
            case 'Ready':
                return ['Accepted', ...baseSteps];
            case 'Preparing':
                return ['Accepted', ...baseSteps];
            case 'New':
            default:
                return ['New', ...baseSteps];
        }
    };

    // Compute the steps to be displayed based on status
    const steps = getSteps();
    // Compute the index of the current step
    const currentStep = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;

    if (complete && showCompleteMessage) {
        return (
            <>
                <motion.div
                    className="flex items-center justify-evenly mb-2 bg-white rounded-lg p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <FaCheckCircle size={50} color="#198038" />
                    <div className="ml-4 w-full">
                        <p className="text-gray-800 text-xl font-semibold">100% Complete</p>
                        <motion.div
                            className="flex w-[90%] mt-2 bg-gray-200 rounded-full overflow-hidden"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1 }}
                        >
                            <motion.div className="h-3 bg-[#198038]" initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5 }}></motion.div>
                        </motion.div>
                    </div>
                </motion.div>
                <Separator className="mb-4" />
            </>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            <ol className="flex w-full max-w-lg mx-auto px-5 mb-9 mt-4 items-center justify-center">
                {steps.map((step, index) => (
                    <motion.li
                        key={index}
                        className={`flex items-center ${index < steps.length - 1 ? 'w-full' : ''}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div className="relative flex flex-col items-center">
                            <motion.span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-in-out ${step === 'Rejected'
                                    ? 'bg-red-500'
                                    : step === 'New'
                                        ? 'bg-white border-2 border-gray-300'
                                        : index <= currentStep
                                            ? 'bg-[#0162DD]'
                                            : 'bg-white border-2 border-gray-300'
                                    } dark:bg-[#3C48FC] dark:text-[#fff] ${index === currentStep ? 'dark:bg-[#E2E9F0] dark:text-[#A0B1C0]' : ''
                                    }`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {step === 'New' ? (
                                    <span className="text-xs">0{index + 1}</span>
                                ) : index <= currentStep ? (
                                    <svg
                                        aria-hidden="true"
                                        className="h-5 w-5"
                                        fill="white"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                ) : (
                                    <span className="text-xs">0{index + 1}</span>
                                )}
                            </motion.span>
                            <div
                                className={`absolute top-0 mt-10 text-xs font-sans text-center ${step === 'New' ? 'text-black' : step === 'Rejected' ? 'text-red-500' : index <= currentStep ? 'text-[#0162DD] font-bold' : ''}`}
                            >
                                {step}
                            </div>
                        </div>

                        {index < steps.length - 1 && (
                            <div
                                className={`flex-auto mx-2 border-t-2 ${index < currentStep ? 'border-[#0162DD]' : 'border-[#E2E9F0]'
                                    } dark:border-[#A0B1C0]`}
                            ></div>
                        )}
                    </motion.li>
                ))}
            </ol>
            <ViewOrder orderID={orderID} />
            <Separator className="mb-4" />
        </div>
    );
}
