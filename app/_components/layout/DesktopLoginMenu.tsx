"use client";
import React from "react";
import Link from "next/link";

import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { useRouter } from "next/navigation";

import { handleLogout } from "@/app/_lib/utils/auth-utils";

const DesktopLoginMenu = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogoutAction = async () => {
    await handleLogout(logout, () => {
      router.push("/login");
    });
  };

  return (
    <div className="flex items-center gap-4 ml-8">
      {isAuthenticated ? (
        <>
          <button
            className="py-2 px-4 bg-transparent text-red-500 border border-red-500 rounded text-sm cursor-pointer transition-all hover:bg-red-500/10"
            onClick={handleLogoutAction}
          >
            Log Out
          </button>
          <Link
            href="/profile"
            className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
          >
            Profile
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
          >
            Log In
          </Link>
          
        </>
      )}
    </div>
  );
};

export default DesktopLoginMenu;
