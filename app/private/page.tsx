import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import TestClient from "./Test";

export default async function PrivatePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <TestClient />
      <p>Hello {session.user.email} , client</p>
    </>
  );
}
