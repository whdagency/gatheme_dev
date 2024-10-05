import React, { useState } from "react";
import {
  HappyEmoji,
  MiniSadEmoji,
  NeutralEmoji,
  SadEmoji,
  SmileEmoji,
} from "../components/icons";
import FeedbackSuccess from "../modals/feedback-success";
import { toast } from "sonner";
import AnimatedLayout from "../shared/AnimateLayout";
import { useMenu } from "../hooks/useMenu";
import { hexToRgba } from "../lib/utils";
import { useTranslation } from "react-i18next";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { customization } = useMenu();
  const { t } = useTranslation("global");

  // Emojis and their states
  const emojis = [
    { id: 1, symbol: SadEmoji },
    { id: 2, symbol: MiniSadEmoji },
    { id: 3, symbol: NeutralEmoji },
    { id: 4, symbol: SmileEmoji },
    { id: 5, symbol: HappyEmoji },
  ];

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleEmojiSelect = (id) => {
    setSelectedEmoji((prev) => {
      if (prev === id) {
        return null;
      }
      return id;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission logic here later

    if (!selectedEmoji) {
      toast.error(t("feedback.selectFeedback"));
      return;
    }

    console.log("Feedback Submitted:", feedback);
    console.log("Selected Rating:", selectedEmoji);

    setShowSuccessModal(true);

    setFeedback("");
    setSelectedEmoji(null);
  };

  return (
    <AnimatedLayout>
      <div className="pb-28 flex flex-col items-center justify-center mt-10">
        {/* Header */}
        <div className="md:px-6 text-center">
          <h2
            className="text-xl font-semibold text-black"
            style={{
              color: customization?.selectedTextColor,
            }}
          >
            {t("feedback.title")}
          </h2>
        </div>

        {/* Feedback Image */}
        <img
          src="/assets/feedback.png"
          alt="Feedback"
          className="w-[369px] h-auto"
        />

        {/* Feedback Form Section */}
        <form className="md:px-10 px-3" onSubmit={handleSubmit}>
          <div
            className="flex flex-col items-center justify-center p-6 -mt-16"
            style={{
              borderRadius: "10px",
              background: "#FFF",
              boxShadow: "0px 4px 15.1px 0px rgba(0, 0, 0, 0.15)",
            }}
          >
            <h3
              className="text-2xl font-semibold text-center text-gray-900"
              style={{
                color: customization?.selectedTextColor,
              }}
            >
              {t("feedback.giveUsYour")}{" "}
              <span
                className="text-[#F86A2E]"
                style={{
                  color: customization?.selectedPrimaryColor,
                }}
              >
                {t("feedback.feedback")}
              </span>
            </h3>

            <p
              className="mt-2 text-center text-base text-[#C2C2C2] font-medium"
              style={{
                color: customization?.selectedSecondaryColor,
                opacity: 0.6,
              }}
            >
              {t("feedback.feedbackDesc")}
            </p>

            {/* Emoji Reaction Section */}
            <div className="flex justify-center my-4">
              <div className="flex items-center justify-center gap-4">
                {emojis.map((emoji) => (
                  <span
                    key={emoji.id}
                    className={`text-3xl cursor-pointer`}
                    onClick={() => handleEmojiSelect(emoji.id)}
                  >
                    <emoji.symbol
                      strokeColor={
                        selectedEmoji === emoji.id
                          ? customization?.selectedPrimaryColor
                          : hexToRgba(
                              customization?.selectedSecondaryColor,
                              0.4
                            )
                      }
                      className={`${
                        selectedEmoji === emoji.id ? "scale-110" : "scale-100"
                      }`}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Feedback Input */}
            <textarea
              className="focus:outline-none focus:border-[#EFEFF0] w-full h-24 p-3 mt-4 border border-[#EFEFF0] bg-[#EFEFF0] rounded-lg placeholder:text-[#A0A5BA] text-[#535353]"
              placeholder={t("feedback.placeholder")}
              value={feedback}
              onChange={handleFeedbackChange}
              rows={10}
            ></textarea>
          </div>

          {/* Send Button */}
          <button
            className="hover:bg-orange-500 mt-7 w-full py-4 font-semibold text-white bg-[#F86A2E] rounded-full"
            style={{
              background: customization?.selectedPrimaryColor,
              color: customization?.selectedIconColor,
            }}
          >
            {t("feedback.sendFeedback")}
          </button>
        </form>
      </div>

      <FeedbackSuccess open={showSuccessModal} setOpen={setShowSuccessModal} />
    </AnimatedLayout>
  );
};

export default Feedback;
