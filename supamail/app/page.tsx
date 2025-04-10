import EmailManagement from "@/components/email-management";
import { createClient } from "@/utils/supabase/server";
import React from "react";

const Page = async () => {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return <div>Please login first</div>;
  }

  const { data: folders, error: foldersError } = await supabase
    .from("folders")
    .select("*");
  const { data: emails, error: emailsError } = await supabase
    .from("email_status")
    .select(
      "*, folder:folder_id(*), email:emails!email_status_email_id_fkey(*, sender:sender_profile_id(*), recipients:email_recipients(*, profile:recipient_profile_id(*)))",
    );

  if (!emails || !folders || !user.user) {
    console.error(emailsError, foldersError);
    return <div>Error loading emails or folders</div>;
  }

  return <EmailManagement emails={emails} folders={folders} user={user.user} />;
};

export default Page;
