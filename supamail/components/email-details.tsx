"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/use-app";
import { Star, StarOff, Trash2 } from "lucide-react";

const EmailDetails = () => {
  const { selectedEmail, folders, setSelectedEmail } = useApp();

  //   TODO: handleDeleteEmail
  const handleDeleteEmail = (emailId: string) => {};

  //   TODO: handleToggleStar
  const handleToggleStar = (emailId: string) => {};

  return (
    <div className="flex-1 flex flex-col">
      {selectedEmail ? (
        <>
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {selectedEmail.email.subject}
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleStar(selectedEmail.email_id)}
              >
                {selectedEmail.is_starred ? (
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <StarOff className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteEmail(selectedEmail.email_id)}
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback>
                  {selectedEmail.email.sender.email_address.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {selectedEmail.email.sender.email_address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {"To: " +
                    selectedEmail.email.recipients
                      .map((recipient) => recipient.profile.email_address)
                      .join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(selectedEmail.email.created_at).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm">
                {selectedEmail.email.body
                  .split("\n")
                  .map((line: string, i: number) => (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* // TODO: move to folder */}
          {/* <div className="p-4 border-b">
              <h3 className="text-sm font-medium mb-2">Move to folder</h3>
              <div className="flex flex-wrap gap-2">
                {folders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveToFolder(folder.id)}
                  >
                    {folder.name}
                  </Button>
                ))}
              </div>
            </div> */}
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No email selected</h2>
            <p className="text-muted-foreground">
              Select an email to view its contents
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDetails;
