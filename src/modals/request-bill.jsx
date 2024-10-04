import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerDescription,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BillIcon } from "../components/icons";
import NotificationModal from "./notification-modal";
import { submitNotification } from "../lib/notification";
import { useMenu } from "../hooks/useMenu";
import ClipLoader from "react-spinners/ClipLoader";

const RequestBill = () => {
  const { table_id, restos, customization } = useMenu();
  const [isBillRequested, setIsBillRequested] = useState(false);
  const [pending, setPending] = useState(false);

  const handleCallWaiter = async (e) => {
    e.preventDefault();
    setPending(true);

    if (!table_id) {
      toast.info(t("No table selected"));
      return;
    }

    const isSubmitted = await submitNotification({
      type: "Bill",
      title: "Asking For Bill",
      resto_id: restos.id,
      table_id: table_id,
    });

    setPending(false);

    if (isSubmitted) {
      setIsBillRequested(true);
    } else {
      toast.error("Failed to request bill. Please try again later.");
    }
  };

  if (isBillRequested) {
    return (
      <NotificationModal
        open={isBillRequested}
        setOpen={setIsBillRequested}
        title="Bill Requested!"
        description="The bill will be sent to you shortly."
      />
    );
  }

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
          <BillIcon fill={customization?.selectedPrimaryColor} />
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
        <DrawerTitle className="text-2xl font-semibold capitalize">
          Request Your Bill!
        </DrawerTitle>
        <DrawerDescription className="text-[#A7AEC1] text-sm text-center">
          Are you ready to settle your bill? Let us know, and we&apos;ll bring
          it right to your table!
        </DrawerDescription>

        <DrawerFooter className="flex justify-center">
          <Button
            onClick={handleCallWaiter}
            disabled={pending}
            className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full w-full flex items-center gap-2"
            style={{ background: customization?.selectedPrimaryColor }}
          >
            {pending && (
              <ClipLoader size={20} loading={pending} color={"#ffffff"} />
            )}{" "}
            Request Bill
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RequestBill;
