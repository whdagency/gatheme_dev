import React, { useState } from "react";
import i18next from "i18next";

const SelectBox = () => {
  const [selectedLang, setSelectedLang] = useState("fr"); 
  const [isOpen, setIsOpen] = useState(false); 

  const languages = [
    { code: "fr", label: "Fr", flag: "https://flagcdn.com/w320/fr.png" },
    { code: "en", label: "Eng", flag: "https://flagcdn.com/w320/gb.png" },
  ];

  const handleChange = (langCode) => {
    setSelectedLang(langCode);
    i18next.changeLanguage(langCode); 
    setIsOpen(false); 
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <div className="relative inline-block z-50">

      {/* <div className="relative"> */}
        <button
          type="button"
          onClick={toggleMenu} 
          className="inline-flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <img
            src={languages.find(lang => lang.code === selectedLang)?.flag}
            alt="selected flag"
            className="w-6 h-4 mr-2 rounded-full"
          />
          {languages.find(lang => lang.code === selectedLang)?.label}
          <svg className="ml-2 w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

       
        {isOpen && (
          <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <ul className="py-1">
              {languages.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleChange(lang.code)} 
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <img src={lang.flag} alt={lang.label} className="w-6 h-4 mr-2" />
                    {lang.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      {/* </div> */}
    </div>
  );
};

export default SelectBox;

