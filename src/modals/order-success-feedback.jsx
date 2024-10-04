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

const OrderSuccessFeddback = ({ open, setOpen }) => {
  // Feedback states
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [additionalComments, setAdditionalComments] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate feedback input
    if (!selectedFeedback) {
      toast.error("Please select a feedback rating");
      return;
    }

    const feedbackData = {
      rating: selectedFeedback,
      comments: additionalComments || "",
    };

    console.log("Submitted Feedback:", feedbackData);

    setSelectedFeedback(null);
    setAdditionalComments("");

    // Redirect back to menu
    setOpen(false);
  };

  const reactions = [
    {
      emoji: "/assets/bad.png",
      name: "Bad",
    },
    {
      emoji: "/assets/decent.png",
      name: "Decent",
    },
    {
      emoji: "/assets/love-it.png",
      name: "Love it!",
    },
  ];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="flex flex-col max-w-md gap-4 p-10 mx-auto -mb-10 text-center rounded-t-[30px]">
        <DrawerTitle className="text-2xl font-semibold capitalize">
          Rate Your Experience
        </DrawerTitle>

        <DrawerDescription className="text-[#A7AEC1] text-sm text-center sr-only">
          How was your experience with us?
        </DrawerDescription>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Emoji Feedback */}
          <div className="flex justify-between gap-5">
            {reactions.map((reaction) => (
              <button
                key={reaction.name}
                type="button"
                className={`p-[6px_10px] flex items-center border border-[#B8B8B8] rounded-[10px] w-full whitespace-nowrap text-center gap-2 ${
                  selectedFeedback === reaction.name ? "bg-[#E5E5E5]" : ""
                }`}
                onClick={() => {
                  setSelectedFeedback((prev) => {
                    if (prev === reaction.name) {
                      return null;
                    }
                    return reaction.name;
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
            placeholder="Tell us more (optional)"
            className="w-full p-[19px_21px] border border-[#E2E4EA] rounded-xl text-black text-sm placeholder:text-sm placeholder:text-[#9DA0A3] outline-none focus:outline-none"
            rows={5}
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
          />

          {/* Submit Button */}
          <DrawerFooter className="-mt-2">
            <Button
              type="submit"
              className="hover:bg-orange-600 px-10 py-6 text-white bg-[#F86A2E] rounded-full w-full"
            >
              Submit your feedback
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default OrderSuccessFeddback;
