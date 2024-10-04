import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";

const OrderCancelled = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { restoSlug, table_id } = useMenu();

  const handleNavigateToMenu = () => {
    setOpen(false);
    navigate(`/menu/${restoSlug}?table_id=${table_id}`);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col max-w-md gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        {/* Icon or Image for Cancellation */}
        <div className="pt-7 flex justify-center mb-4">
          <img
            src="/assets/order-cancelled.png"
            alt="Order cancelled"
            className="w-[151px] h-[151px]"
          />
        </div>

        {/* Title */}
        <DrawerTitle className="text-2xl font-semibold capitalize">
          Order Cancelled
        </DrawerTitle>

        {/* Description */}
        <DrawerDescription className="text-[#A7AEC1] text-sm text-center">
          Sorry, your order has been rejected. If this was a mistake, you can
          place a new order from the menu or call a waiter to verify.
        </DrawerDescription>

        {/* Footer */}
        <DrawerFooter className="flex justify-center mt-4">
          <Button
            onClick={handleNavigateToMenu}
            className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full w-full"
          >
            Back to Home
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default OrderCancelled;
