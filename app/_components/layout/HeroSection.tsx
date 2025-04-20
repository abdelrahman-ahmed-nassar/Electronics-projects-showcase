"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Hero Section Component
const HeroSection = () => {
  const [animateCircuit, setAnimateCircuit] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    // Trigger animations after component mounts
    setTimeout(() => setAnimateCircuit(true), 300);
    setTimeout(() => setIsVisible(true), 500);

    // Mouse movement effect for parallax
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Create and animate particles
    if (particlesRef.current) {
      createParticles();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Create electronic particles animation
  const createParticles = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !particlesRef.current) return;

    const container = particlesRef.current;
    // Clear existing particles
    container.innerHTML = "";

    // Create new particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 4 + 1;

      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;

      // Random colors from theme
      const colors = ["#4d94ff", "#64ffda", "#ffb300"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Set particle style
      particle.style.position = "absolute";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = "50%";
      particle.style.backgroundColor = color;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = (Math.random() * 0.5 + 0.1).toString();

      // Animation properties
      particle.style.animation = `float ${
        Math.random() * 10 + 10
      }s linear infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(particle);
    }
  };

  // Calculate parallax effect based on mouse position
  const getParallaxStyle = (intensity: number) => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return {}; // Return empty object if not in browser
    }

    const maxMove = 20 * intensity;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const moveX = ((mousePosition.x - centerX) / centerX) * maxMove;
    const moveY = ((mousePosition.y - centerY) / centerY) * maxMove;

    return {
      transform: `translate(${moveX}px, ${moveY}px)`,
      transition: "transform 0.1s ease-out",
    };
  };

  return (
    <section className="flex flex-col justify-center items-center text-center relative overflow-hidden p-5 min-h-[100vh]">
      {/* Dynamic animated background with electronic circuit pattern */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-1500 ${
          animateCircuit ? "opacity-20" : ""
        }`}
        style={{
          backgroundImage:
            "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
          backgroundSize: "20px 20px, 40px 40px, 40px 40px",
          backgroundPosition: "0 0, 0 0, 0 0",
          backgroundBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      ></div>

      {/* Glowing circuit nodes and connections */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        {/* Circuit nodes */}
        <div className="absolute top-[15%] left-[10%] w-4 h-4 bg-electric-blue rounded-full opacity-60 shadow-[0_0_15px_5px_rgba(77,148,255,0.4)] animate-pulse"></div>
        <div
          className="absolute top-[30%] left-[25%] w-3 h-3 bg-mint-green rounded-full opacity-60 shadow-[0_0_15px_5px_rgba(100,255,218,0.4)] animate-pulse"
          style={{ animationDelay: "0.7s" }}
        ></div>
        <div
          className="absolute top-[70%] left-[15%] w-5 h-5 bg-amber rounded-full opacity-60 shadow-[0_0_15px_5px_rgba(255,179,0,0.4)] animate-pulse"
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className="absolute top-[20%] right-[20%] w-6 h-6 bg-electric-blue rounded-full opacity-60 shadow-[0_0_15px_5px_rgba(77,148,255,0.4)] animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-[50%] right-[10%] w-4 h-4 bg-mint-green rounded-full opacity-60 shadow-[0_0_15px_5px_rgba(100,255,218,0.4)] animate-pulse"
          style={{ animationDelay: "0.9s" }}
        ></div>
        <div
          className="absolute bottom-[20%] right-[30%] w-5 h-5 bg-amber rounded-full opacity-60 shadow-[0_0_15px_5px_rgba(255,179,0,0.4)] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Circuit connections - glowing lines */}
        <div className="absolute top-[15%] left-[10%] w-[30vw] h-[1px] bg-gradient-to-r from-electric-blue to-transparent opacity-40 transform origin-left"></div>
        <div className="absolute top-[15%] left-[10%] w-[1px] h-[30vh] bg-gradient-to-b from-electric-blue to-transparent opacity-40"></div>
        <div className="absolute top-[30%] left-[25%] w-[40vw] h-[1px] bg-gradient-to-r from-mint-green to-transparent opacity-40 transform rotate-12 origin-left"></div>
        <div className="absolute top-[50%] right-[10%] w-[20vw] h-[1px] bg-gradient-to-l from-mint-green to-transparent opacity-40 transform -rotate-15 origin-right"></div>
        <div className="absolute top-[20%] right-[20%] w-[1px] h-[40vh] bg-gradient-to-b from-electric-blue to-transparent opacity-40"></div>

        {/* Animated circuit pulses - data flowing along the lines */}
        <div className="absolute top-[15%] left-[10%] w-[5px] h-[5px] bg-electric-blue rounded-full shadow-[0_0_10px_5px_rgba(77,148,255,0.6)] animate-circuit-pulse-horizontal"></div>
        <div
          className="absolute top-[30%] left-[25%] w-[5px] h-[5px] bg-mint-green rounded-full shadow-[0_0_10px_5px_rgba(100,255,218,0.6)] animate-circuit-pulse-diagonal"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-[15%] left-[10%] w-[5px] h-[5px] bg-electric-blue rounded-full shadow-[0_0_10px_5px_rgba(77,148,255,0.6)] animate-circuit-pulse-vertical"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-[50%] right-[10%] w-[5px] h-[5px] bg-mint-green rounded-full shadow-[0_0_10px_5px_rgba(100,255,218,0.6)] animate-circuit-pulse-horizontal-reverse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Floating electronic particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 -z-5 overflow-hidden pointer-events-none"
      ></div>

      {/* Animated binary code backdrop - subtle tech effect */}
      <div className="absolute inset-0 -z-6 overflow-hidden opacity-5">
        <div className="animate-binary-fall text-[10px] leading-none text-electric-blue font-mono whitespace-nowrap">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 0.3}s` }}
              className="whitespace-pre"
            >
              {Array.from({ length: 200 })
                .map(() => Math.round(Math.random()))
                .join(" ")}
            </div>
          ))}
        </div>
      </div>

      {/* Electronic component decorative elements */}
      <div className="absolute top-[10%] left-[5%] w-16 h-8 border-2 border-mint-green rounded-md opacity-20 flex items-center justify-center text-[8px] text-mint-green">
        R220Ω
      </div>
      <div className="absolute bottom-[15%] right-[8%] w-12 h-12 border-2 border-electric-blue rounded-full opacity-20 flex items-center justify-center text-[8px] text-electric-blue">
        10μF
      </div>
      <div className="absolute top-[25%] right-[12%] border-l-2 border-t-2 border-b-2 border-amber w-8 h-6 opacity-20 after:content-[''] after:absolute after:border-r-2 after:border-t-2 after:border-b-2 after:border-amber after:right-[-8px] after:top-0 after:bottom-0 after:skew-x-[20deg]"></div>

      {/* Main content with parallax effect */}
      <div
        className={`relative z-10 max-w-6xl mx-auto p-10 rounded-xl backdrop-blur-md bg-gradient-to-br from-navy/40 via-navy/60 to-navy/40 border border-electric-blue/30 shadow-[0_0_50px_rgba(77,148,255,0.2)] transition-all duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={getParallaxStyle(0.2)}
      >
        {/* Hexagon shape accent */}
        <div className="absolute -top-10 -left-10 w-20 h-20 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-electric-blue via-mint-green to-electric-blue rotate-45 rounded-xl shadow-lg"></div>
          <span className="absolute text-navy text-2xl">⚡</span>
        </div>

        {/* Animated gradient title */}
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative"
          style={getParallaxStyle(0.3)}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-mint-green via-electric-blue to-mint-green animate-gradient-x">
            Electronics Engineering
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue via-amber to-mint-green animate-gradient-x animation-delay-1000">
            Student Showcase
          </span>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-1 bg-gradient-to-r from-transparent via-mint-green to-transparent rounded-full"></div>
        </h1>

        {/* Animated description text */}
        <p
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white/90"
          style={getParallaxStyle(0.1)}
        >
          Discover{" "}
          <span className="text-mint-green font-semibold">
            innovative projects
          </span>{" "}
          and
          <span className="text-electric-blue font-semibold">
            {" "}
            technical excellence
          </span>{" "}
          from the next generation of{" "}
          <span className="text-amber font-semibold">
            electronics engineers
          </span>
          .
        </p>

        {/* Interactive buttons with hover effects */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          style={getParallaxStyle(0.4)}
        >
          <Link
            href="#projects"
            className="group relative py-4 px-10 bg-gradient-to-r from-mint-green to-electric-blue text-navy border-none rounded-full font-bold cursor-pointer no-underline transition-all duration-300 overflow-hidden hover:shadow-[0_0_20px_rgba(77,148,255,0.5)] z-10"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            <span className="relative flex items-center justify-center">
              <span className="mr-2">Explore Projects</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Link>

          <Link
            href="/teams"
            className="group relative py-4 px-10 bg-transparent text-electric-blue border-2 border-electric-blue rounded-full font-bold cursor-pointer no-underline transition-all duration-300 hover:shadow-[0_0_20px_rgba(77,148,255,0.3)] z-10 overflow-hidden"
          >
            <span className="absolute inset-0 bg-electric-blue/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            <span className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Meet Our Teams
            </span>
          </Link>

          <Link
            href="/contact"
            className="group relative py-4 px-10 bg-transparent text-mint-green border-2 border-mint-green rounded-full font-bold cursor-pointer no-underline transition-all duration-300 hover:shadow-[0_0_20px_rgba(100,255,218,0.3)] z-10 overflow-hidden"
          >
            <span className="absolute inset-0 bg-mint-green/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            <span className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Get Involved
            </span>
          </Link>
        </div>

        {/* Tech stat counters */}
        <div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          style={getParallaxStyle(0.1)}
        >
          <div className="bg-navy/50 rounded-lg p-4 border border-electric-blue/20 backdrop-blur-sm">
            <div
              className="text-4xl font-bold text-electric-blue mb-2 counter"
              data-target="150"
            >
              150+
            </div>
            <div className="text-white/70">Student Projects</div>
          </div>
          <div className="bg-navy/50 rounded-lg p-4 border border-mint-green/20 backdrop-blur-sm">
            <div
              className="text-4xl font-bold text-mint-green mb-2 counter"
              data-target="45"
            >
              45+
            </div>
            <div className="text-white/70">Research Teams</div>
          </div>
          <div className="bg-navy/50 rounded-lg p-4 border border-amber/20 backdrop-blur-sm">
            <div
              className="text-4xl font-bold text-amber mb-2 counter"
              data-target="12"
            >
              12+
            </div>
            <div className="text-white/70">Award Winners</div>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator - more sophisticated */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="relative flex flex-col items-center justify-center cursor-pointer group">
          <span className="text-mint-green text-xs mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
            Scroll to discover
          </span>
          <div className="w-6 h-10 border-2 border-mint-green/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-mint-green rounded-full animate-scroll-down"></div>
          </div>
        </div>
      </div>

      {/* Add keyframes for custom animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes circuit-pulse-horizontal {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(30vw);
            opacity: 0;
          }
        }

        @keyframes circuit-pulse-horizontal-reverse {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-20vw);
            opacity: 0;
          }
        }

        @keyframes circuit-pulse-vertical {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(30vh);
            opacity: 0;
          }
        }

        @keyframes circuit-pulse-diagonal {
          0% {
            transform: translate(0, 0) rotate(12deg);
            opacity: 1;
          }
          100% {
            transform: translate(40vw, 8vh) rotate(12deg);
            opacity: 0;
          }
        }

        @keyframes scroll-down {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          75% {
            transform: translateY(5px);
            opacity: 0;
          }
          80% {
            transform: translateY(0);
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(0) translateX(10px);
          }
          75% {
            transform: translateY(10px) translateX(5px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        @keyframes binary-fall {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 8s ease infinite;
        }

        .animate-circuit-pulse-horizontal {
          animation: circuit-pulse-horizontal 3s linear infinite;
        }

        .animate-circuit-pulse-horizontal-reverse {
          animation: circuit-pulse-horizontal-reverse 3s linear infinite;
        }

        .animate-circuit-pulse-vertical {
          animation: circuit-pulse-vertical 3s linear infinite;
        }

        .animate-circuit-pulse-diagonal {
          animation: circuit-pulse-diagonal 3s linear infinite;
        }

        .animate-scroll-down {
          animation: scroll-down 2s ease-in-out infinite;
        }

        .animate-binary-fall {
          animation: binary-fall 20s linear infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
