import React from "react";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";

const NotFound = () => {
  const navigate = useNavigate();
  const slug = window.location.pathname.split("/")[2] || "";
  const { customization } = useMenu();

  const handleGoHome = () => {
    navigate(`/menu/${slug}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-8 text-xl text-gray-600">Oops! Page not found.</p>
      <button
        onClick={handleGoHome}
        className="hover:bg-orange-600 px-6 py-3 text-white transition-colors bg-orange-500 rounded-md"
        style={{
          background: customization?.selectedPrimaryColor,
        }}
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
