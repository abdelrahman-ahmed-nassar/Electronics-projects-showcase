"use client";
import Link from "next/link";
import { BiRocket } from "react-icons/bi";


export default function NotFound() {
  return (
    <div className="flex-center-both  w-full px-10 text-center min-h-[70vh]">
      <div className="w-full font-h1 font-w-bold en flex-center-both flex-col space-y-6">
        <div className="w-full flex-center-both space-x-6 flex-col md:flex-row">
          <span className="flex space-x-2 text-5xl font-com">
            <span>4</span>
            <span className="flex-center-both transform text-purple-700 -translate-y-px">
              <BiRocket />
            </span>
            <span>4</span>
          </span>
          <span className="tracking-widest text-4xl text-gray-600 ">
            NOT FOUND
          </span>
        </div>
        <div className="h-2 w-1/2 bg-secondaryContainer rounded-md smooth"></div>
        <div></div>
        <div className="space-y-2 flex-center-both flex-col">
          <div className="clr-text-secondary text-3xl">
            ! عذرًا و لكن هذه الصفحة غير موجودة علي الموقع
          </div>
          <div className="text-teal-500 font-bold text-2xl underline">
            <Link href="/">! العودة للصفحة الرئيسية</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
