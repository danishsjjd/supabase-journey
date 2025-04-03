import Link from "next/link";

import { CommentSection } from "@/components/comment-section";
import DeletePostButton from "@/components/delete-post-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { Pencil } from "lucide-react";

async function PostDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select(
      `
    *,
    user:user_id (
      name
    )
  `
    )
    .eq("id", Number(id))
    .single();

  if (!post) {
    return (
      <Card className="max-w-3xl mx-auto p-6">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Post not found
          </h2>
          <p className="text-muted-foreground mb-6">
            The post you&apos;re looking for doesn&apos;t seem to exist.
          </p>
          <Button asChild>
            <Link href="/">Back to Posts</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="px-5 mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{post.title}</h1>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="icon">
              <Link href={`/admin/edit/${post.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <DeletePostButton id={post.id} />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 p-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary">
            {post.user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="font-medium">{post.user.name}</div>
          <div className="text-sm text-muted-foreground">
            {post.is_published ? "Published" : "Draft"}
          </div>
        </div>
      </div>

      <div className="prose lg:prose-xl">
        <p>{post.content}</p>

        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}

export default PostDetails;
