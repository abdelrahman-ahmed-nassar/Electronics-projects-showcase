import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Electronics Projects",
  description: "Electronic Projects",
};

import Header from "./_components/Header";
import Footer from "./_components/Footer";
import ScrollToTop from "./_components/UI/ScrollToTop";

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
      <body className={`${orbitron.variable} ${exo2.variable}`}>
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
            <ScrollToTop />
            <Footer></Footer>
          </Header>
        </AuthenticationProvider>
      </body>
    </html>
  );
}
