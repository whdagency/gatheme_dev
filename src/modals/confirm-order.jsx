import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";

const ConfirmOrder = ({ open, setOpen, submitOrder, orderPending }) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col max-w-md gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <div className="pt-7 flex justify-center mb-4">
          <img
            src="/assets/confirm-order.png"
            alt="feedback success"
            className="w-[151px] h-[151px]"
          />
        </div>
        <DrawerTitle className="text-2xl font-semibold capitalize">
          Confirm Order
        </DrawerTitle>

        <DrawerDescription className="text-[#A7AEC1] text-sm text-center">
          If everything looks good, hit &apos;Confirm Order&apos; below, and
          we&apos;ll start preparing your meal right away!
        </DrawerDescription>

        <DrawerFooter className="flex justify-center">
          <Button
            disabled={orderPending}
            onClick={submitOrder}
            className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full w-full text-center flex items-center gap-2"
          >
            {orderPending && (
              <ClipLoader size={20} loading={orderPending} color={"#ffffff"} />
            )}{" "}
            {"Confirm Order"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ConfirmOrder;
