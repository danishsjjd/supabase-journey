"use client";

import React from "react";
import { Button } from "./ui/button";
import { handleDeletePost } from "@/actions/post";
import { Trash2 } from "lucide-react";

const DeletePostButton = ({ id }: { id: number }) => {
  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={() => handleDeletePost(id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};

export default DeletePostButton;
