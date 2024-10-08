import React, { useState } from "react";
import { useMenu } from "../../hooks/useMenu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { useTranslation } from "react-i18next";

import { axiosInstance } from "../../../axiosInstance";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { APIURL } from "../../lib/ApiKey";
import ClipLoader from "react-spinners/ClipLoader";
import { ClaimsIcon } from "../icons";
const formSchema = z
  .object({
    clamer_name: z.string().optional(),
    description: z.string().min(1, "Message is Required").max(500),
    infos: z.optional(z.string()),
    anonymCheckBox: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.anonymCheckBox && data.infos === "") {
      ctx.addIssue({
        code: "custom",
        message: "Please enter your email or phone number",
        path: ["infos"],
      });
    }

    if (!data.anonymCheckBox && data.clamer_name === "") {
      ctx.addIssue({
        code: "custom",
        message: "Please enter your name",
        path: ["clamer_name"],
      });
    }
  });

const ThemeOneClaims = ({ open, setOpen }) => {
  const { restos: items, table_id, customization } = useMenu();
  const [claimsSuccessModal, setClaimsSuccessModal] = useState(false);
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting: pending },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clamer_name: "",
      infos: "",
      description: "",
      anonymCheckBox: false,
    },
  });
  const DEFAULT_THEME = {
    id: 4,
    selectedBgColor: "#fff",
    selectedHeader: "logo-header",
    selectedLayout: "theme-grid",
    selectedPrimaryColor: "#000",
    selectedSecondaryColor: "#6B7280",
    selectedTheme: 1,
    selectedTextColor: "#fff",
    selectedIconColor: "#fff",
    isDefault: true,
  };
  const isAnonymous = watch("anonymCheckBox");

  console.log("The IsAnno => ", isAnonymous);

  // submit claim
  const onSubmit = async (data) => {
    try {
      // If the checkbox is checked, send only the description
      const res = await axiosInstance.post("/api/claims", {
        description: data.description,
        clamer_name: isAnonymous == true ? "Annonymos" : data.clamer_name,
        email: isAnonymous == true ? null : data.infos,
        resto_id: items.id,
      });
      if (res) {
        reset();
        console.log("Return Successfully");
        // toast.success('Event has been created');
        const notification = {
          title: "New Claim",
          status: "Claim",
          resto_id: items.id,
          table_id: table_id,
        };
        const responseNotification = await fetch(
          `${APIURL}/api/notifications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notification),
          }
        );
        setClaimsSuccessModal(true);
      }
    } catch (err) {
      console.log("The err =>", err);
      Object.entries(response.data.errors).forEach((error) => {
        const [fieldName, errorMessages] = error;
        setError(fieldName, {
          message: errorMessages.join(),
        });
      });
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          side="bottom"
          id="hide"
          className="scrollbar-hide ms-auto flex flex-col items-center justify-center w-full max-w-md h-[28rem]"
        >

          <div className="scrollbar-hide w-full max-w-md mt-6 p-6 overflow-y-scroll rounded-lg">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center justify-center gap-0">
                <div className="flex items-center justify-center gap-3 flex-col">
                  <ClaimsIcon fill={customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor} />


                  <h2
                    style={{ color: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }}
                    className="text-[27px] font-bold text-nowrap text-black font-[Inter]"
                  >
                    {t('claims.makeClaim')}  {t('claims.claim')}
                  </h2>
                </div>

                <p
                  style={{ color: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor }}
                  className="text-center mt-0 text-[14px] font-[Inter] font-normal"
                >
                  {t('claims.tellUs')}
                </p>
              </div>



              <form
                method="post"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5 mt-2"
              >
                <div
                  className={`relative w-full ${isAnonymous ? "bg-gray-100" : "bg-gray-200"} rounded`}
                >
                  <input
                    type="text"
                    name="clamer_name"
                    id="clamer_name"
                    disabled={isAnonymous}
                    {...register("clamer_name", {
                      required: isAnonymous ? false : true,
                    })}
                    className="peer focus:outline-none focus:ring-0 focus:border-0 dark:text-gray-300 block w-full py-4 pl-3 pr-10 text-gray-700 placeholder-[#666] bg-transparent border-0 rounded-md"
                    placeholder={t('claims.name')}
                    onPointerDown={(e) => e.stopPropagation()}
                  />

                  <label
                    htmlFor="clamer_name"
                    className={`left-4 top-1/2 peer-focus:top-0 peer-focus:left-2 peer-focus:text-xs peer-focus:text-gray-700 absolute font-medium text-gray-700 transition-all transform -translate-y-1/2 ${watch("clamer_name") !== "" ? "-top-0 left-2 text-xs text-gray-700" : ""}`}
                  >

                  </label>
                </div>
                {errors.clamer_name && !isAnonymous && (
                  <p className="-mt-4 text-sm text-red-600">
                    {errors.clamer_name?.message}
                  </p>
                )}

                <div
                  className={`relative w-full ${isAnonymous ? "bg-gray-100" : "bg-gray-200"} rounded`}
                >
                  <input
                    type="email"
                    name="infos"
                    id="infos"
                    disabled={isAnonymous}
                    {...register("infos", {
                      required: isAnonymous ? false : true,
                    })}
                    className="peer focus:outline-none focus:ring-0 focus:border-0 dark:text-gray-300 block w-full py-4 pl-3 pr-10 text-gray-700 placeholder-[#666] bg-transparent border-0 rounded-md"
                    placeholder={t('claims.email')}
                  />
                </div>
                {errors.infos && !isAnonymous && (
                  <p className="-mt-4 text-sm text-red-600">
                    {errors.infos?.message}
                  </p>
                )}

                <div className="relative flex items-center w-full gap-2 rounded">
                  <Checkbox
                    checked={getValues("anonymCheckBox")}
                    {...register("anonymCheckBox")}
                    onCheckedChange={(value) => {
                      setValue("anonymCheckBox", value);
                    }}
                    name="anonymCheckBox"
                    id="anonymCheckBox"
                  />
                  <label
                    htmlFor="anonymCheckBox"
                    className="text-sm text-[#808080] font-[Inter]"
                  >
                    {t('claims.anonymous')}
                  </label>
                </div>

                <div className="relative w-full pl-3 py-2 bg-gray-200 rounded">
                  <textarea
                    rows={5}
                    type="text"
                    name="description"
                    id="description"
                    {...register("description")}
                    className="peer block w-full rounded-md border-0 py-1.5 pr-10 text-gray-700 placeholder-[#666] focus:outline-none focus:ring-0 focus:border-0 dark:text-gray-300 bg-transparent"
                    placeholder={t('claims.thoughts')}
                    onPointerDown={(e) => e.stopPropagation()}
                  />

                </div>
                {errors.description && (
                  <p className="-mt-4 text-sm text-red-600">
                    {errors.description?.message}
                  </p>
                )}

                <div className="flex items-center justify-between gap-5">
                  <button
                    style={{
                      backgroundColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor,
                      color: customization?.isDefault == false ? customization.selectedBgColor : DEFAULT_THEME.selectedBgColor,
                    }}

                    className="w-full font-[Inter] text-[15px] font-medium p-3 text-center text-white rounded-md"
                    type="submit"
                    disabled={pending}
                  >
                    {pending ? (
                      <ClipLoader
                        color={customization?.selectedIconColor}
                        visible={pending}
                        loading={pending}
                        size={25}
                      />
                    ) : (
                      <>{t('claims.submit')}</>
                    )}
                  </button>

                  <button
                    style={{
                      borderColor: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor,
                      color: customization?.isDefault == false ? customization.selectedPrimaryColor : DEFAULT_THEME.selectedPrimaryColor,
                    }}
                    className="w-1/2 p-3 text-center rounded-md border-[1.43px] bg-transparent font-[Inter] text-[15px] font-medium"
                    type="button"
                    onClick={() => reset()}
                  >
                    {t('claims.Reset')}
                  </button>
                </div>
              </form>

              <AlertDialog
                open={claimsSuccessModal}
                onOpenChange={setClaimsSuccessModal}
              >
                <AlertDialogContent className="w-[80%] rounded-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t('claims.successClaim')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('claims.thankYou')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      autoFocus
                      onClick={() => {
                        setClaimsSuccessModal(false);
                        setOpen(false);
                      }}
                    >
                      Close
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ThemeOneClaims;
