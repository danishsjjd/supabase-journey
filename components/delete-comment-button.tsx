"use client";

import { deleteComment } from "@/actions/comments";
import { toast } from "sonner";
import { Button } from "./ui/button";

const DeleteCommentButton = ({
  id,
  postId,
}: {
  id: number;
  postId: number;
}) => {
  const handleDelete = async () => {
    try {
      const result = await deleteComment(id, postId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Comment deleted successfully!");
    } catch (_) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteCommentButton;
