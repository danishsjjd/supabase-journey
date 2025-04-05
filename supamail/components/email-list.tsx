"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/context/use-app";
import { cn, dateIOSFormat } from "@/lib/utils";

const EmailList = () => {
  const { emails, setSelectedEmail, selectedEmail } = useApp();

  return (
    <div className="w-1/3 border-r overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        {/* // TODO: foldername */}
        <h2 className="text-xl font-semibold capitalize">Inbox</h2>
        <p className="text-sm text-muted-foreground">
          {/* // TODO: number of emails in folder */}0 emails
        </p>
      </div>

      <ScrollArea className="flex-1">
        {emails.length > 0 ? (
          <div className="divide-y">
            {emails.map((emailStatus) => {
              const { email, email_id, folder, is_read, profile_id } =
                emailStatus;

              return (
                <div
                  key={email_id}
                  className={cn(
                    "p-4 cursor-pointer transition-colors hover:bg-muted/50 flex items-start justify-between mb-1",
                    selectedEmail?.email_id === email_id && "bg-muted/50"
                  )}
                  onClick={() => setSelectedEmail(emailStatus.email_id)}
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>
                        {email.sender.email_address.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {email.sender.email_address}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {email.subject} - {email.body}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(dateIOSFormat(email.created_at)).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No emails found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EmailList;
