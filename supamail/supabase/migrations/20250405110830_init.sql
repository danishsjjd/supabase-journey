-- tables
create table "profiles" (
  "id" uuid primary key,
  "email_address" varchar(255) unique not null
);

create table "folders" (
  "id" uuid primary key default (gen_random_uuid()),
  "name" varchar(255) not null
);

create table "emails" (
  "id" uuid primary key default (gen_random_uuid()),
  "sender_profile_id" uuid not null,
  "subject" varchar(255) not null,
  "body" text not null,
  "created_at" timestamptz not null default (now())
);

create table "email_recipients" (
  "id" uuid primary key default (gen_random_uuid()),
  "email_id" uuid not null,
  "recipient_profile_id" uuid not null,

  constraint unique_email_recipient unique ("email_id", "recipient_profile_id")
);

create table "email_replies" (
  "id" uuid primary key default (gen_random_uuid()),
  "email_id" uuid not null,
  "reply_email_id" uuid not null,
  
  -- Add foreign key constraints
  constraint "fk_email_replies_email" foreign key ("email_id") references "emails" ("id") on delete cascade,
  constraint "fk_email_replies_reply_email" foreign key ("reply_email_id") references "emails" ("id") on delete cascade,
  
  -- Ensure a reply can't be linked to itself
  constraint "email_replies_no_self_reply" check ("email_id" != "reply_email_id")
);

create table "email_status" (
  "email_id" uuid not null,
  "profile_id" uuid not null,
  "is_read" boolean not null default false,
  "is_starred" boolean not null default false,
  "folder_id" uuid,

  "created_at" timestamptz not null default (now()),
  "updated_at" timestamptz not null default (now()),
  "deleted_at" timestamptz,
  
   primary key ("email_id", "profile_id")
);

-- foreign key constraints
alter table "emails" add foreign key ("sender_profile_id") references "profiles" ("id");
alter table "email_recipients" add foreign key ("email_id") references "emails" ("id");
alter table "email_recipients" add foreign key ("recipient_profile_id") references "profiles" ("id");
alter table "email_status" add foreign key ("email_id") references "emails" ("id");
alter table "email_status" add foreign key ("profile_id") references "profiles" ("id"),
add foreign key ("email_id") references "emails" ("id");
alter table "email_status" add foreign key ("folder_id") references "folders" ("id");


-- functions
create function "public"."handle_new_user"()
returns trigger
set search_path = ''
as $$
  begin
    insert into public.profiles (id, email_address)
    values (new.id, new.email);
    return new;
  end;
$$
language plpgsql security definer;

-- trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
    execute procedure "public"."handle_new_user"();

-- extension
create extension if not exists moddatetime schema extensions;

create trigger email_status_handle_updated_at before update on email_status
  for each row execute procedure moddatetime (updated_at);
