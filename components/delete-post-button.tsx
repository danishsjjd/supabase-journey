"use client";

import React from "react";
import { Button } from "./ui/button";
import { handleDeletePost } from "@/actions/post";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const DeletePostButton = ({ id }: { id: number }) => {
  const handleDelete = async () => {
    const result = await handleDeletePost(id);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Post deleted successfully!");
  };

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};

export default DeletePostButton;
