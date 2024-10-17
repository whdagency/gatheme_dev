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
  const { customization, resInfo } = useMenu();
  const [feedback, setFeedback] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { t } = useTranslation("global");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedReviewType, setSelectedReviewType] = useState(null);
  const { google_buss, trustpilot_link } = resInfo;
  const hasGoogle = google_buss !== null && google_buss !== "";
  const hasTrustpilot = trustpilot_link !== null && trustpilot_link !== "";

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

  const clearFeedback = (showModal = false) => {
    setShowFeedbackForm(false);
    setFeedback("");
    setSelectedReviewType(null);
    setSelectedEmoji(null);
    setShowSuccessModal(showModal);
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

    if (!selectedEmoji) {
      toast.error(t("feedback.selectFeedback"));
      return;
    }

    if (selectedEmoji <= 3) {
      clearFeedback(true);
    } else {
      if (selectedReviewType === "google" && hasGoogle) {
        window.open(google_buss, "_blank");
        clearFeedback(false);
        return;
      }

      if (selectedReviewType === "trustpilot" && hasTrustpilot) {
        window.open(trustpilot_link, "_blank");
        clearFeedback(false);
        return;
      }
    }

    console.log("Feedback Submitted:", feedback);
    console.log("Selected Rating:", selectedEmoji);

    clearFeedback(true);
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

        {!showFeedbackForm && (
          <LeaveReview
            hasGoogle={hasGoogle}
            hasTrustpilot={hasTrustpilot}
            setShowFeedbackForm={setShowFeedbackForm}
            setSelectedReviewType={setSelectedReviewType}
          />
        )}

        {/* Feedback Form Section */}
        {showFeedbackForm && (
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
        )}
      </div>

      <FeedbackSuccess open={showSuccessModal} setOpen={setShowSuccessModal} />
    </AnimatedLayout>
  );
};

export default Feedback;

const LeaveReview = ({
  hasGoogle,
  hasTrustpilot,
  setShowFeedbackForm,
  setSelectedReviewType,
}) => {
  const { t } = useTranslation("global");

  const handleShowForm = (type) => {
    setSelectedReviewType(type);
    setShowFeedbackForm(true);
  };

  return (
    <main className="md:px-20 flex flex-col items-stretch justify-center w-full px-10 -mt-16 bg-white">
      <div className="space-y-7 text-center">
        <h1 className="text-2xl capitalize pt-2 font-bold text-[#333] dark:text-[#f8f8f8]">
          {t("rating.leaveReview")}
        </h1>

        {(hasGoogle || hasTrustpilot) && (
          <p className="text-[#666]  dark:text-[#ccc]">
            {t("rating.btnReview")}
          </p>
        )}

        <div className="grid w-full grid-cols-1 gap-2">
          {hasGoogle && (
            <button
              className="hover:bg-blue-400 hover:text-white flex items-center justify-center gap-2 px-2 py-5 font-bold text-black transition-colors bg-gray-200 rounded-lg"
              onClick={() => handleShowForm("google")}
              target="_blank"
            >
              <img
                src={"/assets/google.svg"}
                alt="Google Reviews"
                className="w-8 h-8 mr-2"
              />
              Google Reviews
            </button>
          )}

          {hasTrustpilot && hasGoogle && (
            <p className="text-[#666] dark:text-[#ccc]">{t("rating.or")}</p>
          )}

          {hasTrustpilot && (
            <button
              className="bg-gray-200 hover:bg-[#009967] hover:text-white text-black font-bold py-5 px-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={() => handleShowForm("trustpilot")}
              target="_blank"
            >
              <img
                src={"/assets/trustpilot.svg"}
                alt="TrustPilot"
                className="w-8 h-8 mr-2"
              />
              Trustpilot Reviews
            </button>
          )}

          {!hasGoogle && !hasTrustpilot && (
            <p className="text-[#666] dark:text-[#ccc]">{t("rating.desc")}</p>
          )}
        </div>
      </div>
    </main>
  );
};
