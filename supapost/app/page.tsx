import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      user:user_id (
        name
      )
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div className="px-5 py-2 space-y-4">
      {posts?.map((post) => (
        <Card key={post.id} className="flex flex-col max-w-5xl mx-auto">
          <Link href={`/post/${post.id}`}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="line-clamp-3">{post.content}</p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Posted by {post.user.name}
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
}
