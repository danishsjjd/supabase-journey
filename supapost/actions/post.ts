"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const handleDeletePost = async (id: number) => {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  return redirect("/admin");
};
