import { checkInstitutionExistence } from "@/lib/api";
import { LoginForm } from "./form";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/api/auth";

export default async function Page() {
  const exists = await checkInstitutionExistence();
  const auth = await getServerSession();

  if (!exists) {
    redirect("/config");
  }

  if (auth?.user) {
    redirect("/app");
  }

  return <LoginForm />;
}
