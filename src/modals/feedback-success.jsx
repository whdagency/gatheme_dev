import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";

const FeedbackSuccess = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { restoSlug, table_id } = useMenu();

  const handleSubmit = () => {
    setOpen(false);
    navigate(`/menu/${restoSlug}?table_id=${table_id}`);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col max-w-md gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <div className="pt-7 flex justify-center mb-4">
          <img
            src="/assets/feedback-success.png"
            alt="feedback success"
            className="w-[151px] h-[151px]"
          />
        </div>
        <DrawerTitle className="text-2xl font-semibold capitalize">
          Thank You for Your Feedback!
        </DrawerTitle>

        <DrawerDescription className="text-[#A7AEC1] text-sm text-center">
          Thank you for sharing your thoughts! We’ve received your feedback and
          are always striving to improve your experience.
        </DrawerDescription>

        <DrawerFooter className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full w-full"
          >
            Back to Home
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FeedbackSuccess;
