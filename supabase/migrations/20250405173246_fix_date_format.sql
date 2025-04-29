alter table "public"."comments" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."posts" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;
