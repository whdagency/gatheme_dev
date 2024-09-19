import { Link } from "react-router-dom";
import Trust from "./trustpilot-2.svg";
import Google from "./icons8-google.svg";
import Spinner from "react-spinner-material";
import { useTranslation } from "react-i18next";

export default function Rate({ infoRes }) {
  if (!infoRes) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner
          size={100}
          color={"#28509E"}
          spinnerWidth={1}
          visible={true}
          style={{ borderColor: "#28509E", borderWidth: 2 }}
        />
      </div>
    );
  }
  const { t, i18n } = useTranslation("global");
  const isArabic = i18n.language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const { google_buss, trustpilot_link } = infoRes;
  console.log("gg ", google_buss, "pilot", trustpilot_link);
  const hasGoogle = google_buss !== null && google_buss !== "";
  const hasTrustpilot = trustpilot_link !== null && trustpilot_link !== "";

  return (
    <main className=" flex flex-col items-center justify-center h-screen px-4">
      <div className="space-y-6 text-center">
      <div>kkk</div> 
        <h1 className="text-2xl font-bold text-[#333] dark:text-[#f8f8f8]">
    
          Leave us a review!
        </h1>
      ddd
       

        {(hasGoogle || hasTrustpilot) && (
          <p className="text-[#666] dark:text-[#ccc]">
            Tap a button below to share your experience.
          </p>
        )}
        <div className="grid w-full grid-cols-1 gap-4">
          {hasGoogle && (
            <Link
              className="hover:bg-blue-400 hover:text-white flex items-center justify-center gap-2 px-4 py-6 font-bold text-black transition-colors bg-gray-200 rounded-lg"
              to={google_buss}
            >
              <img src={Google} alt="Google Reviews" className="w-8 h-8 mr-2" />
              Google Reviews
            </Link>
          )}
          {hasTrustpilot && hasGoogle && (
            <p className="text-[#666] dark:text-[#ccc]">Or</p>
          )}
          {hasTrustpilot && (
            <Link
              className="bg-gray-200 hover:bg-[#009967] hover:text-white text-black font-bold py-6 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              to={trustpilot_link}
            >
              <img src={Trust} alt="TrustPilot" className="w-8 h-8 mr-2" />
              Trustpilot Reviews
            </Link>
          )}
          {!hasGoogle && !hasTrustpilot && (
            <p className="text-[#666] dark:text-[#ccc]">
              We&apos;re working on adding review functionality soon. Stay
              tuned!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
