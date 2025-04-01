import { deleteComment } from "@/actions/comments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tables } from "@/utils/supabase/database.types";
import { getUser } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/server";
import { CommentForm } from "./comment-form";

type Comment = Tables<"comments"> & { user: Tables<"users"> };

async function getComments(postId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      user:users(*)
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch comments");
  }

  return (data || []) as Comment[];
}

export async function CommentSection({ postId }: { postId: number }) {
  const [comments, user] = await Promise.all([getComments(postId), getUser()]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      <Card className="p-4 mb-8">
        <CommentForm postId={postId} user={user} />
      </Card>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="group">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 mt-1">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {comment.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{comment.user.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>

                    <div className="ml-auto flex gap-2">
                      <form
                        action={async () => {
                          "use server";
                          await deleteComment(comment.id, postId);
                        }}
                      >
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </form>
                      <CommentForm
                        postId={postId}
                        user={user}
                        comment={comment}
                      />
                    </div>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                </div>
              </div>
              <Separator className="mt-4" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
