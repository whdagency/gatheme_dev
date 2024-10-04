import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMenu } from "../hooks/useMenu";

const NotificationModal = ({ open, setOpen, title = "", description = "" }) => {
  const { customization } = useMenu();
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col max-w-md gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <DrawerTitle className="text-2xl font-semibold capitalize">
          {title}
        </DrawerTitle>

        <DrawerDescription className="text-[#A7AEC1] text-sm text-center">
          {description}
        </DrawerDescription>

        <DrawerFooter className="flex justify-center">
          <Button
            onClick={handleClose}
            className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full"
            style={{
              background: customization?.selectedPrimaryColor,
            }}
          >
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationModal;
