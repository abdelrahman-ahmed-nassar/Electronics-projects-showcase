"use client";
import React from "react";
import Image from "next/image";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import ProfileCard from "@/public/images/default-user-profile-image.svg";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";

function Page() {
  const authContext = useAuth();
  if (!authContext.user) return <div></div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-dark-800 dark:text-white">
        Profile
      </h1>

      <div className="card bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-dark-700">
        <div className="md:flex">
          {/* Profile Image Section */}
          <div className="md:w-1/3 bg-gradient-to-br from-primary-500 to-primary-700 p-6 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
              <Image
                src={ProfileCard}
                alt="Profile Image"
                className="object-cover"
                fill
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {authContext.user.name}
            </h2>
            <p className="text-primary-100 text-sm">Student</p>
          </div>

          {/* Profile Details Section */}
          <div className="md:w-2/3 p-6">
            <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-4">
              Contact Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                  <FiPhone className="text-lg" />
                </div>
                <div className="mr-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Phone Number
                  </p>
                  <p className="font-medium text-dark-800 dark:text-white">
                    {authContext.user.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                  <FiMail className="text-lg" />
                </div>
                <div className="mr-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-dark-800 dark:text-white">
                    {authContext.user.email}
                  </p>
                </div>
              </div>

              {authContext.user.team && (
                <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                    <FiMapPin className="text-lg" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
