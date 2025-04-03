import { signOutAction } from "@/actions/auth";
import { getUser } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function AuthButton() {
  const user = await getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <span>Hey, {user.email}!</span>
      <form
        action={async () => {
          "use server";
          await signOutAction();
        }}
      >
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
      <Link href="/admin">
        <Button>Admin Dashboard</Button>
      </Link>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Login in</Link>
      </Button>
    </div>
  );
}
