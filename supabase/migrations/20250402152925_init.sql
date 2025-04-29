create table users (
    id uuid primary key,
    name varchar(255) not null
);

create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
  begin
    insert into public.users (id, name)
    values (new.id, new.raw_user_meta_data->>'name');
    return new;
  end;
$$
language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
    execute procedure public.handle_new_user();

-- 
create table posts (
    id serial primary key,
    user_id uuid not null,
    title varchar(255) not null,
    content text not null,
    is_published boolean not null default false,
    created_at timestamp not null default now()
);

-- 
create table comments (
    id serial primary key,
    post_id integer not null,
    user_id uuid not null,
    content text not null,
    created_at timestamp not null default now()
);

alter table users add constraint users_id_fk foreign key (id) references auth.users(id);
alter table posts add constraint posts_user_id_fk foreign key (user_id) references users(id);
alter table comments add constraint comments_user_id_fk foreign key (user_id) references users(id);
alter table comments add constraint comments_post_id_fk foreign key (post_id) references posts(id);
