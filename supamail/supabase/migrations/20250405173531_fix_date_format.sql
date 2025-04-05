alter table "public"."folders" alter column "created_at" set data type timestamptz using "created_at"::timestamptz;

alter table "public"."emails" alter column "created_at" set data type timestamptz using "created_at"::timestamptz;
alter table "public"."emails" alter column "deleted_at" set data type timestamptz using "deleted_at"::timestamptz;

alter table "public"."email_recipients" alter column "created_at" set data type timestamptz using "created_at"::timestamptz;

alter table "public"."email_status" alter column "deleted_at" set data type timestamptz using "deleted_at"::timestamptz;
