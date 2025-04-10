"use client";

import { AppProvider } from "@/context/use-app";

import type { Email } from "@/context/use-app";
import type { Tables } from "@/utils/supabase/database.types";
import type { User } from "@supabase/supabase-js";
import EmailDetails from "./email-details";
import EmailList from "./email-list";
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
