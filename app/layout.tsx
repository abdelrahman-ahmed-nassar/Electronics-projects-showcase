import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Electronics Projects",
  description: "Electronic Projects",
};

import Header from "./_components/Header";
import Footer from "./_components/Footer";

// Import Toastify CSS
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { AuthenticationProvider } from "./_lib/context/AuthenticationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <AuthenticationProvider>
          <Header>
            {children}

            <Footer></Footer>
          </Header>
        </AuthenticationProvider>
      </body>
    </html>
  );
}
