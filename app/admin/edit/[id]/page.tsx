import { PostForm } from "@/components/post-form";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select(
      `
    *,
    user:user_id (*)
  `
    )
    .eq("id", Number(id))
    .single();

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {post ? (
        <PostForm post={post} user_id={post.user_id} />
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold">Post not found</h2>
          <p className="text-muted-foreground mt-2">
            The post you&apos;re trying to edit doesn&apos;t exist.
          </p>
        </div>
      )}
    </main>
  );
}
