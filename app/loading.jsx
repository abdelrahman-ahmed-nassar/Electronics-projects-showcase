import React from "react";
import { GiCircuitry } from "react-icons/gi";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full bg-gray-900 overflow-hidden relative">
      {/* Main animated logo container */}
      <div className="relative">
        {/* Pulsing circle background */}
        <div
          className="absolute inset-0 rounded-full bg-primary-400/20 animate-ping"
          style={{ animationDuration: "1.5s" }}
        ></div>

        {/* Spinning outer ring */}
        <div
          className="w-32 h-32 rounded-full border-4 border-transparent border-t-primary-400 border-b-secondary-500 animate-spin"
          style={{ animationDuration: "2s" }}
        ></div>

        {/* Logo or icon in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full shadow-lg flex items-center justify-center">
            <GiCircuitry className="text-gray-100 text-xl" />
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-8 text-gray-200 font-medium">
        Connecting Circuits...
      </div>

      {/* Progress bar at the bottom */}
      <div className="absolute bottom-16 w-64 md:w-80 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full animate-progress"></div>
      </div>
    </div>
  );
};

export default Loading;
