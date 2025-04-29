import DeletePostButton from "@/components/delete-post-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { getUser } from "@/utils/supabase/server";
export default async function AdminPage() {
  const user = await getUser();

  if (!user?.id) {
    return <p>Not logged in</p>;
  }

  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select()
    .eq("user_id", user.id);

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline">View Site</Button>
          </Link>
          <Link href="/admin/create">
            <Button>Create New Post</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{post.title}</CardTitle>
              <Badge variant={post.is_published ? "default" : "outline"}>
                {post.is_published ? "Published" : "Draft"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link href={`/admin/edit/${post.id}`}>
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <DeletePostButton id={post.id} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
