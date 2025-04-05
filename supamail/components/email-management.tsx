"use client";

import { AppProvider } from "@/context/use-app";

import { Email } from "@/context/use-app";
import { Tables } from "@/utils/supabase/database.types";
import { User } from "@supabase/supabase-js";
import EmailList from "./email-list";
import EmailDetails from "./email-details";
import SidebarNavigation from "./sidebar-navigation";
export default function EmailManagement({
  emails,
  folders,
  user,
}: {
  emails: Email[];
  folders: Tables<"folders">[];
  user: User;
}) {
  return (
    <AppProvider emails={emails} folders={folders} user={user}>
      <SidebarNavigation />
      <EmailList />
      <EmailDetails />
    </AppProvider>
  );
}
