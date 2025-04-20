import SecondaryNav from "@/app/_components/layout/SecondaryNav";

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-10 h-full w-full px-5 pb-10 md:pb-20 ">
      <div className="h-72 rounded-lg bg-courseBannerGradient"></div>
      <div className="mx-auto -mt-32 max-w-[96%] rounded-xl border-2 border-slate-500 border-opacity-10 bg-secondaryBg shadow-lg">
        <div className="space-y-10 px-2 py-8 sm:px-10 lg:px-4">
          <SecondaryNav>{children}</SecondaryNav>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}
