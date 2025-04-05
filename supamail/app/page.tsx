import EmailManagement from "@/components/email-management";
import { createClient } from "@/utils/supabase/server";
import React from "react";

const Page = async () => {
  const supabase = await createClient();

  const { data: folders } = await supabase.from("folders").select("*");

  const { data: emails } = await supabase
    .from("email_status")
    .select(
      "*, folder:folder_id(*), email:email_id(*, sender:sender_profile_id(*), recipients:email_recipients!inner(*, profile:recipient_profile_id(*)))"
    );
  const { data: user } = await supabase.auth.getUser();

  if (!emails || !folders || !user.user) {
    return <div>Error loading emails or folders</div>;
  }

  return <EmailManagement emails={emails} folders={folders} user={user.user} />;
};

export default Page;
