import { Tables } from "@/utils/supabase/database.types";
import { User } from "@supabase/supabase-js";
import { useQueryState } from "nuqs";
import { createContext, useContext } from "react";

export type Email = Tables<"email_status"> & {
  email: Tables<"emails"> & {
    sender: Tables<"profiles">;
    recipients: (Tables<"email_recipients"> & {
      profile: Tables<"profiles">;
    })[];
  };
  folder: Tables<"folders"> | null;
};

const AppContext = createContext<{
  emails: Email[];
  folders: Tables<"folders">[];
  selectedEmail: Email | null;
  setSelectedEmail: (email_id: string) => void;
  user: User;
} | null>(null);

const AppProvider = ({
  children,
  emails,
  folders,
  user,
}: {
  children: React.ReactNode;
  emails: Email[];
  folders: Tables<"folders">[];
  user: User;
}) => {
  const [selectedEmailId, setSelectedEmail] = useQueryState("email_id");

  const selectedEmail =
    emails.find((email) => email.email_id === selectedEmailId) ?? null;

  return (
    <AppContext.Provider
      value={{ emails, folders, selectedEmail, setSelectedEmail, user }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};

export { AppProvider, useApp };
