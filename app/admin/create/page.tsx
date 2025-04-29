import { PostForm } from "@/components/post-form";
import { Button } from "@/components/ui/button";
import { getUser } from "@/utils/supabase/server";
import Link from "next/link";

export default async function CreatePostPage() {
  const user = await getUser();

  if (!user?.id) {
    return <p>Not logged in</p>;
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <PostForm user_id={user?.id} />
    </main>
  );
}
