"use client";
import React from "react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { usePathname } from "next/navigation";
import NoData from "../UI/NoData";

const NavLinks = [
  {
    href: "/profile",
    label: "User Profile",
  },
  {
    href: "/profile/notifications",
    label: "Notifications",
  },
  {
    href: "/profile/projects",
    label: "Projects",
  },
  {
    href: "/profile/my-team",
    label: "My Team",
  },
];
const SecondaryNav = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Circuit board background pattern */}
      <div
        className="absolute inset-0 opacity-10 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
          backgroundSize: "20px 20px, 40px 40px, 40px 40px",
          backgroundPosition: "0 0, 0 0, 0 0",
          backgroundBlendMode: "soft-light",
        }}
      ></div>

      {/* Profile Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center rounded-lg bg-dark-800/80 backdrop-blur-sm border border-secondary-500/30 px-6 py-4 shadow-lg transition-all duration-300 hover:shadow-secondary-500/20 hover:border-secondary-500/50">
          <div className="h-16 w-16 flex-shrink-0 rounded-full bg-dark-700 border-2 border-primary-400 text-primary-400 flex items-center justify-center ml-5 shadow-inner transform transition-transform duration-300 hover:scale-105 hover:border-primary-400/80 hover:shadow-primary-400/20">
            <CgProfile className="text-2xl" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            User Profile
          </h1>
        </div>
      </div>

      {/* Navigation and Content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-1/4">
          <div className="sticky top-24 rounded-lg bg-dark-800/90 backdrop-blur-sm border border-secondary-500/20 shadow-lg overflow-hidden">
            <nav className="flex flex-col">
              {NavLinks.map((link) => (
                <NavigationItem
                  key={link.href}
                  href={link.href}
                  isActive={link.href === pathName}
                >
                  {link.label}
                </NavigationItem>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="rounded-lg bg-dark-800/90 backdrop-blur-sm border border-secondary-500/20 p-6 shadow-lg relative overflow-hidden">
            {/* Tech decoration elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/5 rounded-full -mr-16 -mt-16 border border-secondary-500/10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-400/5 rounded-full -ml-20 -mb-20 border border-primary-400/10"></div>

            {children ? children : <NoData />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;

const NavigationItem = ({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) => {
  return (
    <Link
      className={`block px-6 py-3 border-r-4 transition-all duration-300 relative ${
        isActive
          ? "bg-dark-700 border-r-primary-400 text-primary-400 font-medium"
          : "border-r-transparent hover:bg-dark-700/70 text-white/80 hover:text-secondary-500 before:content-[''] before:absolute before:w-0 before:h-[1px] before:bottom-2 before:left-6 before:bg-secondary-500 before:transition-all hover:before:w-16"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
};
