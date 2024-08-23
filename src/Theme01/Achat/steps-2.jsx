import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MdOutlineDoNotDisturb } from "react-icons/md";

function PackageIcon(props) {
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
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function LoaderIcon(props) {
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
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  );
}

function CheckIcon(props) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const StepsBar = ({ status, currentStep, infoRes, complete, canceled }) => {
  const steps = ["New", "Preparing", "Complete"];
  const [isCanceled, setIsCanceled] = useState(false);

  useEffect(() => {
    setIsCanceled(canceled);
  }, [canceled]);

  if (isCanceled) {
    return (
      <div className="flex flex-col items-center justify-center w-full bg-muted/40">
        <Card className="w-full max-w-3xl p-3 sm:p-4">
          <div className="flex items-center justify-center">
            <MdOutlineDoNotDisturb size={65} color="red" />
          </div>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-semibold">Order Canceled</h2>
            <p className="text-sm text-muted-foreground">Your order has been canceled.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full  bg-muted/40">
      <Card className="w-full max-w-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Order Process</h2>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep > 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <PackageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Order</h3>
              <p className="text-sm text-muted-foreground">Order placed successfully</p>
            </div>
          </div>
          <Progress value={currentStep >= 2 ? 100 : 33} className="flex-1 mx-4" />
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep > 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <LoaderIcon className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Preparing</h3>
              <p className="text-sm text-muted-foreground">Order is being prepared</p>
            </div>
          </div>
          <Progress value={currentStep === 3 ? 100 : 0} className="flex-1 mx-4" />
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${complete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              <CheckIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Completed</h3>
              <p className="text-sm text-muted-foreground">Order has been delivered</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StepsBar;
