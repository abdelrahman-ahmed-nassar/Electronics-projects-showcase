"use client";
import Link from "next/link";
import {  BiArrowBack } from "react-icons/bi";
import { GiCircuitry } from "react-icons/gi";

export function Error() {
  return (
    <div className="flex items-center justify-center w-full min-h-[80vh] bg-gray-900 px-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl border border-gray-700">
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* Error icon with Electronics Theme */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full bg-primary-400/20 animate-ping"
              style={{ animationDuration: "2s" }}
            ></div>
            <div className="w-20 h-20 flex items-center justify-center">
              <GiCircuitry className="text-6xl text-primary-400" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-200 tracking-wider uppercase">
            خطأ
          </h1>

          {/* Decorative Line */}
          <div className="h-1 w-24 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full"></div>

          {/* Description */}
          <p className="text-gray-300 max-w-md text-lg">
            حدث خطأ فالموقع. لا تقلق، فريقنا يعمل بالفعل علي إصلاح الخطأ. من
            فضلك قم بإعادة تحميل الصفحة أو عد لاحقا.
          </p>

          {/* Return Button */}
          <Link
            href="/"
            className="mt-4 flex items-center justify-center px-6 py-3 bg-secondary-500 text-white font-medium rounded-lg hover:bg-secondary-600 transition-colors"
          >
            <BiArrowBack className="mr-2" />
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Error;
