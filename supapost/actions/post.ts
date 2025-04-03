"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const handleDeletePost = async (id: number) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      error: "Currently having issue deleting post please try again later",
    };
  }

  return redirect("/admin");
};
