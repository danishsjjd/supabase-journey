"use server";

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
    throw new Error("Failed to create comment");
  }

  revalidatePath(`/post/${postId}`);
}

export async function updateComment(
  commentId: number,
  content: string,
  postId: number
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId);

  if (error) {
    throw new Error("Failed to update comment");
  }

  revalidatePath(`/post/${postId}`);
}

export async function deleteComment(commentId: number, postId: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw new Error("Failed to delete comment");
  }

  revalidatePath(`/post/${postId}`);
}
