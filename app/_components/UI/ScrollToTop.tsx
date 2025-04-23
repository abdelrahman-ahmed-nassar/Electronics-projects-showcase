"use client";

import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    // Add pulse effect when scrolling near bottom
    const scrollPosition = window.scrollY + window.innerHeight;
    const docHeight = document.body.offsetHeight;
    if (scrollPosition > docHeight - 300) {
      setPulseEffect(true);
    } else {
      setPulseEffect(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 flex items-center justify-center 
            w-12 h-12 md:w-16 md:h-16 rounded-full 
            bg-gradient-to-r from-blue-900 to-blue-700 shadow-lg 
            transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12
            group hover:shadow-[0_0_15px_#4d94ff] ${
              pulseEffect ? "animate-pulse" : ""
            }`}
          aria-label="Scroll to top"
        >
          {/* Circuit Lines */}
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
            <div className="absolute top-[25%] left-0 w-full h-[1px] bg-blue-300"></div>
            <div className="absolute top-[50%] left-0 w-full h-[1px] bg-blue-300"></div>
            <div className="absolute top-[75%] left-0 w-full h-[1px] bg-blue-300"></div>
            <div className="absolute top-0 left-[25%] h-full w-[1px] bg-blue-300"></div>
            <div className="absolute top-0 left-[50%] h-full w-[1px] bg-blue-300"></div>
            <div className="absolute top-0 left-[75%] h-full w-[1px] bg-blue-300"></div>
          </div>

          {/* Glowing Nodes */}
          <div className="absolute top-[25%] left-[25%] w-1 h-1 rounded-full bg-blue-200 animate-ping"></div>
          <div
            className="absolute top-[25%] left-[75%] w-1 h-1 rounded-full bg-blue-200 animate-ping"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-[75%] left-[25%] w-1 h-1 rounded-full bg-blue-200 animate-ping"
            style={{ animationDelay: "0.7s" }}
          ></div>
          <div
            className="absolute top-[75%] left-[75%] w-1 h-1 rounded-full bg-blue-200 animate-ping"
            style={{ animationDelay: "0.2s" }}
          ></div>

          {/* Center Arrow */}
          <div className="relative z-10 flex flex-col items-center">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:animate-bounce"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 15l7-7 7 7"></path>
            </svg>

            {/* Glowing ring effect */}
            <div className="absolute w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 group-hover:animate-[ping_1.5s_ease-out_infinite]"></div>
          </div>

          {/* Data flow animation */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div
              className="h-1 bg-blue-300 opacity-70 group-hover:opacity-100"
              style={{
                position: "absolute",
                top: "30%",
                left: "-20%",
                width: "10%",
                transform: "rotate(45deg)",
                animation: "dataFlow 2s linear infinite",
              }}
            ></div>
            <div
              className="h-1 bg-blue-300 opacity-70 group-hover:opacity-100"
              style={{
                position: "absolute",
                top: "60%",
                right: "-20%",
                width: "10%",
                transform: "rotate(-45deg)",
                animation: "dataFlow 2s linear infinite",
                animationDelay: "1s",
              }}
            ></div>
          </div>
        </button>
      )}

      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes dataFlow {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(1000%) rotate(45deg);
          }
        }
      `}</style>
    </>
  );
};

export default ScrollToTop;
