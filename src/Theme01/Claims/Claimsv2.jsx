import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.jsx";
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { axiosInstance } from './../../axiosInstance';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const formSchema = z.object({
  clamer_name: z.string().optional(),
  description: z.string().min(1, 'Message is Required').max(500),
  infos: z.optional(z.string()),
});

export default function Claims({ items, table_id }) {
  const searchInputRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const extraInfo = queryParams.get('table_id');
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [clamer_name, setClamer_name] = useState('');
  const [anonymChecked, setAnonymChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';

  const toggleDisabled = () => {
    setAnonymChecked(!anonymChecked); // Toggle checkbox state
    setDisabled(!disabled); // Toggle disabled state
  };
  const inputDirection = isArabic ? 'rtl' : 'ltr';
  const alertToast = async (setOrderSuccessModalOpen) => {
    return (
      <AlertDialog open={orderSuccessModalOpen} onOpenChange={setOrderSuccessModalOpen}>
        <AlertDialogContent className="w-[80%] rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Your claim has been successfully submitted</AlertDialogTitle>
            <AlertDialogDescription>
              Thank you for your Claim!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction autoFocus onClick={() => setOrderSuccessModalOpen(!orderSuccessModalOpen)}>
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clamer_name: '',
      infos: '',
      description: '',
      anonymCheckBox: false,
    },
  });

  const { setError, formState: { isSubmitting }, reset } = form;

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post('/api/claims', {
        description: data.description,
        clamer_name: data.clamer_name === '' ? "Anonymous" : data.clamer_name,
        email: data.infos === '' ? null : data.infos,
        resto_id: items.id
      });
      if (res) {
        reset();
        const notification = {
          title: "New Claim",
          status: "Claim",
          resto_id: items.id,
          table_id: extraInfo
        };
        const responseNotification = await fetch(`https://backend.garista.com/api/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        });
        setOrderSuccessModalOpen(true);
      }
    } catch (err) {
      Object.entries(err.response.data.errors).forEach(([fieldName, errorMessages]) => {
        setError(fieldName, {
          message: errorMessages.join()
        });
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md p-6 rounded-lg h-full" dir={direction}>
        <div className={cn(
          "space-y-4",
          isArabic && 'text-right'
        )}>
          <div className={`flex items-center justify-between ${isArabic === 'ar' ? 'text-right ml-auto justify-items-end' : 'text-left'}`} dir={isArabic === 'ar' ? 'rtl' : 'ltr'}>
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              {t("claims.makeClaim")} <span className="underline underline-offset-3 decoration-8 decoration-[#28509E] dark:decoration-blue-600">{t("claims.claim")}</span>
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                <SmileIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t("claims.tellUs")}</p>
          <Form {...form} className={` flex flex-row ${isArabic === 'ar' ? '  flex-row-reverse ' : ''}`}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4" >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="clamer_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("claims.name")}</FormLabel>
                        <FormControl >
                          <input
                            className={cn(
                              "flex h-10 w-full rounded-[.5rem] border border-input bg-background px-3 placeholder:text-sm py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                              isArabic && 'text-right'
                            )}
                            ref={searchInputRef}
                            disabled={disabled}
                            placeholder={t("claims.namePlaceholder")}
                            dir={inputDirection}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="infos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-nowrap'>{t("claims.email")}</FormLabel>
                        <FormControl>
                          <input
                            className={cn(
                              "flex h-10 w-full rounded-[.5rem] border border-input bg-background px-3 placeholder:text-sm py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                              isArabic && 'text-right'
                            )}
                            ref={searchInputRef}
                            disabled={disabled}
                            placeholder={t("claims.emailPlaceholder")}
                            dir={inputDirection}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="anonymCheckBox"
                    render={({ field }) => (
                      <FormItem className={`flex border-0 flex-row items-start space-x-4 space-y-0 rounded-md mb-4 ${isArabic === 'ar' ? 'flex-row-reverse items-end space-x-4' : ''}`}>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(value) => { field.onChange(value); toggleDisabled(); }}
                            className={`${isArabic === 'ar' ? ' text-right' : ''}`}
                          />
                        </FormControl>

                        <div className="leading-none space-x-2 pr-2">
                          <FormLabel>
                            {t("claims.anonymous")}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className={cn(
                          "flex min-h-[180px] w-full bg-gray-100 text-gray-900 rounded-md border border-gray-300 px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600",
                        )}
                        placeholder={t("claims.thoughts")}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        rows={5}
                        ref={searchInputRef}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={`flex items-center justify-between ${isArabic ? ' flex justify-end' : ''}`}>
                <Button
                  className={`px-4 py-2 my-4 font-medium text-white rounded-md bg-blue-800 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-offset-gray-800 ${isArabic === 'ar' ? 'justify-end' : ''}`}
                  dir={isArabic === 'ar' ? 'rtl' : 'ltr'}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'} />} {t("claims.submit")}
                </Button>
              </div>

            </form>
          </Form>

          <AlertDialog open={orderSuccessModalOpen} onOpenChange={setOrderSuccessModalOpen}>
            <AlertDialogContent className="w-[80%] rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>{t("claims.successClaim")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("claims.thankYou")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction autoFocus onClick={() => setOrderSuccessModalOpen(!orderSuccessModalOpen)}>
                  {t("menu.ok")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function SmileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}
