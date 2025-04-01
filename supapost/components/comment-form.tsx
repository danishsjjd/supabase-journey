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

    if (!content.trim() || !user) return;

    setIsSubmitting(true);

    try {
      if (mode === "edit" && comment) {
        await updateComment(comment.id, content, postId);
      } else {
        await createComment(content, postId, user.id);
      }
      setContent("");
      setDialogOpen(false);
    } catch (error) {
      console.error(`Failed to ${mode} comment:`, error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={user ? "Write a comment..." : "Please sign in to comment"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
        required
        disabled={!user}
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
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim() || !user}
        >
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
