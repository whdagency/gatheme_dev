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
import { useTranslation } from "react-i18next";

const RequestBill = () => {
  const { table_id, restos, customization } = useMenu();
  const [isBillRequested, setIsBillRequested] = useState(false);
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
      type: "Bill",
      title: "Asking For Bill",
      resto_id: restos.id,
      table_id: table_id,
    });

    setPending(false);

    if (isSubmitted) {
      setIsBillRequested(true);
    } else {
      toast.error(t("common.modals.billRequestFailed"));
    }
  };

  if (isBillRequested) {
    return (
      <NotificationModal
        open={isBillRequested}
        setOpen={setIsBillRequested}
        title={t("common.modals.billRequested")}
        description={t("common.modals.billRequestedDesc")}
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

      <DrawerContent className="flex flex-col max-w-xl gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <div className="pt-7 flex justify-center mb-4">
          <img
            src="/assets/request-bill.png"
            alt="Request Bill"
            className="w-[151px] h-[151px]"
          />
        </div>
        <DrawerTitle className="text-2xl font-semibold capitalize">
          {t("common.modals.requestYourBill")}
        </DrawerTitle>
        <DrawerDescription className="text-[#A7AEC1] text-sm text-center">
          {t("common.modals.requestYourBillDesc")}
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
            {t("common.actions.requestBill")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RequestBill;
