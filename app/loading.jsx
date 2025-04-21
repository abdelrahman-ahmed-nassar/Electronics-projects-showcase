import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full bg-primaryBg overflow-hidden">
      {/* Main animated logo container */}
      <div className="relative">
        {/* Pulsing circle background */}
        <div
          className="absolute inset-0 rounded-full bg-primary/10 animate-ping"
          style={{ animationDuration: "1.5s" }}
        ></div>

        {/* Spinning outer ring */}
        <div
          className="w-32 h-32 rounded-full border-4 border-transparent border-t-primary border-b-secondary animate-spin"
          style={{ animationDuration: "2s" }}
        ></div>

        {/* Logo or icon in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 bg-mainGradient rounded-full shadow-lg flex items-center justify-center animate-pulse"
            style={{ animationDuration: "2s" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress bar at the bottom */}
      <div className="absolute bottom-16 w-64 md:w-80 h-1 bg-gray-200/30 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-progress"></div>
      </div>
    </div>
  );
};

export default Loading;
