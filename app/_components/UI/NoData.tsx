import React from "react";

const NoData: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 text-center drtl"
      dir="rtl"
    >
      <div className="mb-6">
        <div className="relative w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary animate-pulse"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <path d="M13 2v7h7"></path>
            <path d="M10 12v4"></path>
            <circle cx="10" cy="9" r="1"></circle>
          </svg>
          <div className="absolute -bottom-3 right-0 left-0 mx-auto w-20 h-1.5 bg-accentGradient rounded-full"></div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-primaryTxt mb-2 font-almarai">
        No Data
      </h3>

      <p className="text-secondaryTxt max-w-md font-cairo">
        No data available
      </p>
    </div>
  );
};

export default NoData;
