create table "profiles" (
  "id" uuid primary key,
  "email_address" varchar(255) unique not null
);

create table "folders" (
  "id" uuid primary key default (gen_random_uuid()),
  "name" varchar(255) not null,
  "created_at" timestamp not null default (now())
);

create table "emails" (
  "id" uuid primary key default (gen_random_uuid()),
  "sender_profile_id" uuid not null,
  "subject" varchar(255) not null,
  "body" text not null,
  "created_at" timestamp not null default (now()),
  "deleted_at" timestamp
);

create table "email_recipients" (
  "id" uuid primary key default (gen_random_uuid()),
  "email_id" uuid not null,
  "recipient_profile_id" uuid not null,
  "created_at" timestamp not null default (now())
);

create table "email_status" (
  "email_id" uuid primary key,
  "profile_id" uuid not null,
  "deleted_at" timestamp,
  "is_read" boolean not null default false,
  "is_starred" boolean not null default false,
  "folder_id" uuid
);

-- foreign key constraints
alter table "emails" add foreign key ("sender_profile_id") references "profiles" ("id");
alter table "email_recipients" add foreign key ("email_id") references "emails" ("id");
alter table "email_recipients" add foreign key ("recipient_profile_id") references "profiles" ("id");
alter table "email_status" add foreign key ("email_id") references "emails" ("id");
alter table "email_status" add foreign key ("profile_id") references "profiles" ("id");
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
