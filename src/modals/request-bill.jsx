import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BillIcon } from "../components/icons";

const RequestBill = () => {
  return (
    <Drawer>
      <DrawerTrigger>
        <motion.button
          className="bottom-20 absolute right-0 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <BillIcon />
        </motion.button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col max-w-md gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <div className="pt-7 flex justify-center mb-4">
          <img
            src="/assets/request-bill.png"
            alt="Request Bill"
            className="w-[151px] h-[151px]"
          />
        </div>
        <h2 className="text-2xl font-semibold capitalize">
          Request Your Bill!
        </h2>
        <DrawerDescription className="text-[#A7AEC1] text-sm text-center">
          Are you ready to settle your bill? Let us know, and we&apos;ll bring
          it right to your table!
        </DrawerDescription>

        <DrawerFooter className="flex justify-center">
          <Button className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full">
            Request Bill
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RequestBill;
