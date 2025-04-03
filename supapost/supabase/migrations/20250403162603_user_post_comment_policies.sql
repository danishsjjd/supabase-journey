alter table comments enable row level security;
alter table posts enable row level security;
alter table users enable row level security;

create policy "Users can insert comments on published posts" on comments for
insert with check (exists (select 1 from posts where posts.id = comments.post_id and posts.is_published) and user_id = auth.uid());

create policy "Users can view comments of published posts" on comments for
select using (exists (select 1 from posts where posts.id = comments.post_id and posts.is_published));

create policy "Users can delete their own comments" on comments for
delete using (user_id = auth.uid());

create policy "Users can update their own comments" on comments for
update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Anyone can view published posts" on posts for
select using (is_published);

create policy "Users can view their own posts" on posts for
select using (user_id = auth.uid());

create policy "Users can update their own posts" on posts for
update using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own posts" on posts for
delete using (user_id = auth.uid());

create policy "Users can insert their own posts" on posts for
insert with check (user_id = auth.uid());

create policy "Anyone can view users" on users for
select using (true);

alter table comments drop constraint comments_post_id_fk;

alter table comments add constraint comments_post_id_fk 
    foreign key (post_id) references posts(id) on delete cascade; 


