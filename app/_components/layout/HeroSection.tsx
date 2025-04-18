
import Link from "next/link";
// Hero Section Component
const HeroSection = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center relative overflow-hidden p-5 h-[80vh]">
      {/* Using a separate component for the background pattern in the Hero */}
      <div
        className="absolute inset-0 opacity-10 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
          backgroundSize: "20px 20px, 40px 40px, 40px 40px",
          backgroundPosition: "0 0, 0 0, 0 0",
          backgroundBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      ></div>
      <h1 className="text-4xl md:text-5xl mb-5 text-white z-10">
        Electronics Engineering Student Showcase
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mb-8 z-10">
        Discover innovative projects and technical excellence from the next
        generation of electronics engineers.
      </p>
      <Link
        href="#projects"
        className="py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg z-10"
      >
        Explore Projects
      </Link>
    </section>
  );
};
export default HeroSection