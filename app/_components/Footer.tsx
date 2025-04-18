
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-black/20 py-10 px-5 text-center border-t border-electric-blue/30">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="flex gap-5 mb-5 flex-wrap items-center justify-center">
          <Link
            href="about"
            className="text-white/70 no-underline hover:text-mint-green"
          >
            About
          </Link>
          <Link
            href="projects"
            className="text-white/70 no-underline hover:text-mint-green"
          >
            Projects
          </Link>
          <Link
            href="students"
            className="text-white/70 no-underline hover:text-mint-green"
          >
            Students
          </Link>
          <Link
            href="teams"
            className="text-white/70 no-underline hover:text-mint-green"
          >
            Teams
          </Link>
          <Link
            href="contact"
            className="text-white/70 no-underline hover:text-mint-green"
          >
            Contact
          </Link>
        </div>
        <div className="text-white/50 text-sm">
          &copy; 2025 ElectroShowcase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;