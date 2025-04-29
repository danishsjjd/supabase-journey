"use server";

import { INSUFFICIENT_PRIVILEGE_ERROR_CODE } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createComment(
  content: string,
  postId: number,
  userId: string
) {
  const supabase = await createClient();

  const { error } = await supabase.from("comments").insert([
    {
      content,
      post_id: postId,
      user_id: userId,
    },
  ]);

  if (error) {
    if (error.code === INSUFFICIENT_PRIVILEGE_ERROR_CODE) {
      return {
        error:
          "The post might be in draft mode or you may not have the required permissions.",
      };
    }

    return { error: error.message };
  }

  revalidatePath(`/post/${postId}`);
  return { success: true };
}

export async function updateComment(
  commentId: number,
  content: string,
  postId: number
) {
  const supabase = await createClient();

  const response = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId)
    .select("id")
    .single();

  if (response.error) {
    return {
      error: "Currently having issue updating comment please try again later",
    };
  }

  revalidatePath(`/post/${postId}`);
  return { success: true };
}

export async function deleteComment(commentId: number, postId: number) {
  const supabase = await createClient();

  const response = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .select("id")
    .single();

  if (response.error) {
    return {
      error: "Currently having issue deleting comment please try again later",
    };
  }

  revalidatePath(`/post/${postId}`);
  return { success: true };
}
