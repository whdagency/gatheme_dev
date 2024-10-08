import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BellIcon } from "../components/icons";
import { submitNotification } from "../lib/notification";
import { toast } from "sonner";
import NotificationModal from "./notification-modal";
import { useMenu } from "../hooks/useMenu";
import ClipLoader from "react-spinners/ClipLoader";
import { useTranslation } from "react-i18next";

const CallWaiter = () => {
  const { table_id, restos, customization } = useMenu();
  const [isWaiterCalled, setIsWaiterCalled] = useState(false);
  const [pending, setPending] = useState(false);
  const { t } = useTranslation("global");

  const handleCallWaiter = async (e) => {
    e.preventDefault();
    setPending(true);

    if (!table_id) {
      toast.info(t("common.modals.noTableSelected"));
      return;
    }

    const isSubmitted = await submitNotification({
      type: "Waiter",
      title: "New Call For Waiter",
      resto_id: restos.id,
      table_id: table_id,
    });

    setPending(false);

    if (isSubmitted) {
      setIsWaiterCalled(true);
    } else {
      toast.error("common.modals.failedToRequestWaiter");
    }
  };

  if (isWaiterCalled) {
    return (
      <NotificationModal
        open={isWaiterCalled}
        setOpen={setIsWaiterCalled}
        title={t("common.modals.waiterRequested")}
        description={t("common.modals.waiterRequestedDesc")}
      />
    );
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <motion.button
          className="bottom-36 absolute right-0 flex items-center justify-center w-12 h-12 text-white bg-orange-500 rounded-full shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <BellIcon fill={customization?.selectedPrimaryColor} />
        </motion.button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col max-w-xl gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <div className="pt-7 flex justify-center mb-4">
          <img
            src="/assets/call-waiter.png"
            alt="Request Bill"
            className="w-[151px] h-[151px]"
          />
        </div>
        <DrawerTitle className="text-2xl font-semibold capitalize">
          {t("common.modals.callWaiter")}
        </DrawerTitle>
        <DrawerDescription className="text-[#A7AEC1] text-sm text-center">
          {t("common.modals.callWaiterDesc")}
        </DrawerDescription>

        <DrawerFooter className="flex justify-center">
          <Button
            onClick={handleCallWaiter}
            disabled={pending}
            className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full w-full flex items-center gap-2"
            style={{
              background: customization?.selectedPrimaryColor,
            }}
          >
            {pending && (
              <ClipLoader size={20} loading={pending} color={"#ffffff"} />
            )}{" "}
            {t("common.actions.requestWaiter")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CallWaiter;
