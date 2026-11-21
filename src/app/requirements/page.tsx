import { redirect } from "next/navigation";

// The requirements page currently lives at /requiremenrs (typo in folder
// name). Navbar and hero links point at /requirements — redirect them so
// they don't 404.
export default function RequirementsRedirect() {
  redirect("/requiremenrs");
}
