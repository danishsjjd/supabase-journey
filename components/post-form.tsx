"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/database.types";
import { toast } from "sonner";
import { INSUFFICIENT_PRIVILEGE_ERROR_CODE } from "@/lib/data";

interface PostFormProps {
  post?: Tables<"posts"> & { user: Tables<"users"> };
  user_id: string;
}

export function PostForm({ post, user_id }: PostFormProps) {
  const router = useRouter();
  const defaultFormData = {
    title: post?.title || "",
    content: post?.content || "",
    is_published: post?.is_published || false,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response =
        typeof post?.id === "number"
          ? await supabase
              .from("posts")
              .update(formData)
              .eq("id", post?.id)
              .select("id")
          : await supabase
              .from("posts")
              .insert({
                title: formData.title,
                content: formData.content,
                is_published: formData.is_published,
                // TODO: add logic so user cannot edit created_at
                created_at: new Date().toISOString(),
                user_id,
              })
              .select("id");
      const createdPost = response.data?.[0];
      if (createdPost) {
        router.push(`/post/${createdPost.id}`);
      } else {
        if (response.error?.code === INSUFFICIENT_PRIVILEGE_ERROR_CODE) {
          toast.error("You are not authorized to create a post");
        } else {
          toast.error("Unable to upsert post please try again later");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{post ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              rows={10}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_published: checked as boolean })
              }
            />
            <Label htmlFor="is_published">Publish this post</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {post ? "Update Post" : "Create Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
