import { getSession } from "@/lib/rsc-session";
import { redirect } from "next/navigation";

export default async function VerifiedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return <div>{children}</div>;
}
