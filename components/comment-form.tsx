"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment, updateComment } from "@/actions/comments";
import { Tables } from "@/utils/supabase/database.types";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";

type CommentFormProps = {
  postId: number;
  user: User | null;
  comment?: Tables<"comments">;
};

export function CommentForm({ postId, user, comment }: CommentFormProps) {
  const [content, setContent] = useState(() => comment?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const mode = comment ? "edit" : "create";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      let result;
      if (mode === "edit" && comment) {
        result = await updateComment(comment.id, content, postId);
      } else {
        result = await createComment(
          content,
          postId,
          user?.id ?? "69a037de-5777-4d39-bc7d-4488889a7b3e"
        );
      }

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      setContent("");
      setDialogOpen(false);
      toast.success(
        mode === "edit"
          ? "Comment updated successfully!"
          : "Comment posted successfully!"
      );
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={"Write a comment..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
        required
      />
      <div className="flex justify-end gap-2">
        {mode === "edit" && (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting
            ? mode === "edit"
              ? "Updating..."
              : "Posting..."
            : mode === "edit"
              ? "Update Comment"
              : "Post Comment"}
        </Button>
      </div>
    </form>
  );

  if (mode === "edit") {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>
              Edit your comment to update it.
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
}
