import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMenu } from "../hooks/useMenu";
import { useTranslation } from "react-i18next";
import { hexToRgba } from "../lib/utils";
import { submitNotification } from "../lib/notification";
import ClipLoader from "react-spinners/ClipLoader";

const OrderSuccessFeedback = ({ open, setOpen, setFeedbackSubmitted }) => {
  // Feedback states
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [additionalComments, setAdditionalComments] = useState("");
  const { customization, table_id, restos } = useMenu();
  const [pending, setPending] = useState(false);
  const { t } = useTranslation("global");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPending(true);

    if (!table_id) {
      toast.info(t("common.modals.noTableSelected"));
      return;
    }

    // Validate feedback input
    if (!selectedFeedback) {
      toast.error(t("common.modals.orderSuccess.feedbackRequired"));
      return;
    }

    const feedbackData = {
      rating: selectedFeedback,
      comments: additionalComments || "",
    };

    const isSubmitted = await submitNotification({
      type: feedbackData.comments,
      title: `New Order Feedback: ${feedbackData.rating}`,
      resto_id: restos.id,
      table_id: table_id,
    });

    setPending(false);

    if (isSubmitted) {
      console.log("Submitted Feedback:", feedbackData);

      setSelectedFeedback(null);
      setAdditionalComments("");

      // Redirect back to menu
      setOpen(false);

      setFeedbackSubmitted(true);
    } else {
      toast.error("Could not submit feedback");
    }
  };

  const reactions = [
    {
      emoji: "/assets/bad.png",
      name: t("common.modals.orderSuccess.bad"),
      value: "Bad",
    },
    {
      emoji: "/assets/decent.png",
      name: t("common.modals.orderSuccess.decent"),
      value: "Decent",
    },
    {
      emoji: "/assets/love-it.png",
      name: t("common.modals.orderSuccess.loveIt"),
      value: "Love It!",
    },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col max-w-xl gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <DrawerTitle className="text-2xl font-semibold capitalize">
          {t("common.modals.orderSuccess.rateYourExperience")}
        </DrawerTitle>

        <DrawerDescription className="text-[#A7AEC1] text-sm text-center sr-only">
          {t("common.modals.orderSuccess.rateYourExperienceDesc")}
        </DrawerDescription>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Emoji Feedback */}
          <div className="flex items-center justify-between gap-5">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                type="button"
                className={`p-[6px_10px] flex items-center justify-center border border-[#B8B8B8] rounded-[10px] w-full whitespace-nowrap text-center gap-2 ${
                  selectedFeedback === reaction.value ? "bg-[#E5E5E5]" : ""
                }`}
                onClick={() => {
                  setSelectedFeedback((prev) => {
                    if (prev === reaction.value) {
                      return null;
                    }
                    return reaction.value;
                  });
                }}
              >
                <img
                  src={reaction.emoji}
                  alt={reaction.name}
                  className="object-cover w-5 h-5 rounded-full"
                />
                <span className="text-sm font-medium">{reaction.name}</span>
              </button>
            ))}
          </div>

          {/* Optional Comments */}
          <textarea
            placeholder={t("common.modals.orderSuccess.commentPlaceholder")}
            className="w-full p-[19px_21px] border border-[#E2E4EA] rounded-xl text-black text-sm placeholder:text-sm placeholder:text-[#9DA0A3] outline-none focus:outline-none"
            rows={5}
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            style={{
              background: hexToRgba(customization?.selectedPrimaryColor, 0.2),
              color: customization?.selectedTextColor,
            }}
          />

          {/* Submit Button */}
          <DrawerFooter className="-mt-2">
            <Button
              disabled={pending}
              type="submit"
              className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full w-full flex items-center gap-2"
              style={{
                background: customization?.selectedPrimaryColor,
                color: customization?.selectedIconColor,
              }}
            >
              {pending && (
                <ClipLoader size={20} loading={pending} color={"#ffffff"} />
              )}{" "}
              {t("common.modals.orderSuccess.submitFeedback")}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default OrderSuccessFeedback;
