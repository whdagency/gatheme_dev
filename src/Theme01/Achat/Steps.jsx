import React, { useEffect, useState } from "react";
import "./Steps.css";
import { TiTick } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineDoNotDisturb } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StepsBar = ({ status, currentStep, infoRes, complete, canceled }) => {
  const steps = ["Order", "Preparing", "Complete"];
  const [isCanceled, setIsCanceled] = useState(false);

  useEffect(() => {
    setIsCanceled(canceled);
  }, [canceled]);

  console.log("The Status of Step => ", status?.status === "processing");
  console.log("The Complete Steps =>", complete);

  if (isCanceled) {
    return (
      <>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Canceled</h2>
        <div className="flex flex-row justify-start border-2 rounded-lg py-2 gap-4 p-4 shadow-md">
          <MdOutlineDoNotDisturb size={65} color="red" />
          <div className="flex flex-col justify-center items-start gap-0 w-full">
            <p className="text-gray-700">
              <span className="text-2xl font-semibold">Order Canceled</span>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Order Process</h2>

      {!complete ? (
        <div
          className={`flex justify-between border-2 shadow-md rounded-lg py-2 text-sm ${
            infoRes.language === "ar" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              className={`step-item ${
                currentStep === i + 1 ? "active" : ""
              } ${i + 1 < currentStep ? "complete" : ""}`}
            >
              <div className={`step`}>
                {i + 1 < currentStep ? <TiTick size={20} /> : i + 1}
              </div>
              <p className="text-gray-500">{step}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-4 shadow-md">
        <FaCheckCircle size={75} color="#198038" />
        <div className="ml-4 ">
          <p className="text-gray-800 text-xl font-semibold">100% Complet</p>
          <div className=" flex w-60 mt-2 bg-gray-200 rounded-full flex-initial ">
            <div className="h-3 bg-[#198038] rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
      
      )}
    </>
  );
};

export default StepsBar;
