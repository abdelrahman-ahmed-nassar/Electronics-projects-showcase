import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { GiCircuitry } from "react-icons/gi";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center w-full min-h-[80vh] bg-gray-900 px-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-lg p-8 transition-all hover:shadow-xl border border-gray-700">
        <div className="flex flex-col items-center space-y-6 text-center">
          {/* Error Code with Electronics Theme */}
          <div className="flex items-center space-x-2 text-6xl font-bold text-gray-100">
            <span>4</span>
            <span className="relative flex items-center justify-center text-primary-400 animate-pulse">
              <GiCircuitry className="text-7xl" />
            </span>
            <span>4</span>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-200 tracking-wider uppercase">
            Circuit Not Found
          </h1>

          {/* Decorative Line */}
          <div className="h-1 w-24 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full"></div>

          {/* Description */}
          <p className="text-gray-300 max-w-md">
            The page you&apos;re looking for seems to have a broken connection. Our
            debugging team is on it!
          </p>

          {/* Arabic Text */}
          <p className="text-gray-400 text-lg">
            عذرًا و لكن هذه الصفحة غير موجودة علي الموقع !
          </p>

          {/* Return Button */}
          <Link
            href="/"
            className="mt-4 flex items-center justify-center px-6 py-3 bg-secondary-500 text-white font-medium rounded-lg hover:bg-secondary-600 transition-colors"
          >
            <BiArrowBack className="mr-2" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
