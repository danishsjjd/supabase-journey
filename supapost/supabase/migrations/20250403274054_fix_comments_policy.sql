drop policy if exists "Users can view comments of published posts" on comments;

create policy "Enable user to view comments for posts they can view" on comments for
select using (exists (select 1 from posts where posts.id = comments.post_id));
