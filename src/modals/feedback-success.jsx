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
import { useTranslation } from "react-i18next";

const FeedbackSuccess = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { restoSlug, table_id, customization } = useMenu();
  const { t } = useTranslation("global");

  const handleSubmit = () => {
    setOpen(false);
    navigate(`/menu/${restoSlug}?table_id=${table_id}`);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col max-w-xl gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <div className="pt-7 flex justify-center mb-4">
          <img
            src="/assets/feedback-success.png"
            alt="feedback success"
            className="w-[151px] h-[151px]"
          />
        </div>
        <DrawerTitle className="text-2xl font-semibold capitalize">
          {t("common.modals.feedbackSuccess")}
        </DrawerTitle>

        <DrawerDescription className="text-[#A7AEC1] text-sm text-center">
          {t("common.modals.feedbackSuccessDesc")}
        </DrawerDescription>

        <DrawerFooter className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full w-full"
            style={{
              background: customization?.selectedPrimaryColor,
            }}
          >
            {t("common.actions.backToHome")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FeedbackSuccess;
