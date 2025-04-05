"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  Search,
  Trash2,
  Star,
  StarOff,
  FolderPlus,
  Send,
} from "lucide-react";

// Mock data for emails
const mockEmails = [
  {
    id: 1,
    from: "john.doe@example.com",
    name: "John Doe",
    subject: "Weekly Team Meeting",
    content:
      "Hi team, just a reminder that we have our weekly meeting tomorrow at 10 AM. Please prepare your updates and join on time. Looking forward to seeing everyone there!\n\nBest regards,\nJohn",
    date: "2023-10-15T10:30:00",
    read: true,
    starred: false,
    folder: "inbox",
  },
  {
    id: 2,
    from: "sarah.smith@example.com",
    name: "Sarah Smith",
    subject: "Project Deadline Update",
    content:
      "Hello everyone,\n\nI wanted to inform you that the deadline for the current project has been extended by one week. This should give us enough time to address the feedback we received from the client.\n\nPlease let me know if you have any questions.\n\nRegards,\nSarah",
    date: "2023-10-14T14:45:00",
    read: false,
    starred: true,
    folder: "inbox",
  },
  {
    id: 3,
    from: "tech.support@example.com",
    name: "Tech Support",
    subject: "Your Support Ticket #45678",
    content:
      "Dear user,\n\nWe have received your support ticket regarding the login issues you've been experiencing. Our team is currently looking into it and will get back to you as soon as possible.\n\nThank you for your patience.\n\nBest regards,\nTech Support Team",
    date: "2023-10-13T09:15:00",
    read: true,
    starred: false,
    folder: "inbox",
  },
  {
    id: 4,
    from: "newsletter@example.com",
    name: "Weekly Newsletter",
    subject: "Your Weekly Industry Updates",
    content:
      "Hello subscriber,\n\nHere are this week's top industry news and updates:\n\n1. New technology trends in 2023\n2. Upcoming virtual conferences\n3. Job opportunities in tech\n\nStay tuned for more updates next week!\n\nThe Newsletter Team",
    date: "2023-10-12T08:00:00",
    read: true,
    starred: false,
    folder: "inbox",
  },
  {
    id: 5,
    from: "you@example.com",
    name: "You",
    subject: "Project Proposal",
    content:
      "Dear Client,\n\nAttached is the project proposal we discussed in our meeting last week. I've included the timeline, budget, and resource allocation as requested.\n\nPlease review and let me know if you need any clarification or have any questions.\n\nLooking forward to your feedback.\n\nBest regards,\nYou",
    date: "2023-10-11T16:20:00",
    read: true,
    starred: true,
    folder: "sent",
  },
  {
    id: 6,
    from: "you@example.com",
    name: "You",
    subject: "Meeting Confirmation",
    content:
      "Hi Team,\n\nThis is to confirm our meeting scheduled for tomorrow at 2 PM. We'll be discussing the quarterly results and planning for the next quarter.\n\nPlease come prepared with your reports.\n\nRegards,\nYou",
    date: "2023-10-10T11:30:00",
    read: true,
    starred: false,
    folder: "sent",
  },
];

// Mock data for folders
const initialFolders = [
  { id: 1, name: "Important", count: 0 },
  { id: 2, name: "Work", count: 0 },
  { id: 3, name: "Personal", count: 0 },
];

export default function EmailManagement() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [emails, setEmails] = useState(mockEmails);
  const [folders, setFolders] = useState(initialFolders);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [composeEmail, setComposeEmail] = useState({
    to: "",
    subject: "",
    content: "",
  });

  // Filter emails based on active tab and search query
  const filteredEmails = emails.filter((email) => {
    const matchesFolder =
      email.folder === activeTab ||
      (activeTab !== "inbox" &&
        activeTab !== "sent" &&
        email.folder === activeTab);
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && (searchQuery === "" || matchesSearch);
  });

  // Handle email selection
  const handleSelectEmail = (email: any) => {
    setSelectedEmail(email);
    // Mark as read if it wasn't already
    if (!email.read) {
      setEmails(
        emails.map((e) => (e.id === email.id ? { ...e, read: true } : e))
      );
    }
  };

  // Handle email deletion
  const handleDeleteEmail = (emailId: number) => {
    setEmails(emails.filter((email) => email.id !== emailId));
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(null);
    }
  };

  // Handle starring/unstarring emails
  const handleToggleStar = (emailId: number) => {
    setEmails(
      emails.map((email) =>
        email.id === emailId ? { ...email, starred: !email.starred } : email
      )
    );
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail({ ...selectedEmail, starred: !selectedEmail.starred });
    }
  };

  // Handle sending a new email
  const handleSendEmail = () => {
    const newEmail = {
      id: emails.length + 1,
      from: "you@example.com",
      name: "You",
      subject: composeEmail.subject,
      content: composeEmail.content,
      date: new Date().toISOString(),
      read: true,
      starred: false,
      folder: "sent",
    };
    setEmails([newEmail, ...emails]);
    setComposeEmail({ to: "", subject: "", content: "" });
    setIsComposeOpen(false);
  };

  // Handle creating a new folder
  const handleCreateFolder = () => {
    if (newFolder.trim()) {
      const newFolderObj = {
        id: folders.length + 1,
        name: newFolder.trim(),
        count: 0,
      };
      setFolders([...folders, newFolderObj]);
      setNewFolder("");
      setIsNewFolderDialogOpen(false);
    }
  };

  // Handle moving email to a folder
  const handleMoveToFolder = (folderId: number) => {
    if (selectedEmail) {
      const folderName =
        folders.find((f) => f.id === folderId)?.name.toLowerCase() || "inbox";
      setEmails(
        emails.map((email) =>
          email.id === selectedEmail.id
            ? { ...email, folder: folderName }
            : email
        )
      );
      setSelectedEmail({ ...selectedEmail, folder: folderName });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Column - Navigation */}
      <div className="w-64 border-r bg-muted/20 p-4 flex flex-col">
        <div className="mb-6">
          <Button
            className="w-full mb-4"
            onClick={() => setIsComposeOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Compose
          </Button>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs
          defaultValue="inbox"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Folders</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNewFolderDialogOpen(true)}
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-1">
            {folders.map((folder) => (
              <li key={folder.id}>
                <Button
                  variant={
                    activeTab === folder.name.toLowerCase()
                      ? "secondary"
                      : "ghost"
                  }
                  className="w-full justify-start text-sm"
                  onClick={() => setActiveTab(folder.name.toLowerCase())}
                >
                  {folder.name}
                  <Badge variant="outline" className="ml-auto">
                    {
                      emails.filter(
                        (e) => e.folder === folder.name.toLowerCase()
                      ).length
                    }
                  </Badge>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Middle Column - Email List */}
      <div className="w-1/3 border-r overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold capitalize">
            {activeTab === "inbox"
              ? "Inbox"
              : activeTab === "sent"
              ? "Sent"
              : folders.find((f) => f.name.toLowerCase() === activeTab)?.name ||
                activeTab}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredEmails.length}{" "}
            {filteredEmails.length === 1 ? "email" : "emails"}
          </p>
        </div>

        <ScrollArea className="flex-1">
          {filteredEmails.length > 0 ? (
            <div className="divide-y">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedEmail?.id === email.id ? "bg-muted/50" : ""
                  } ${!email.read ? "font-medium" : ""}`}
                  onClick={() => handleSelectEmail(email)}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={`/placeholder.svg?height=32&width=32`}
                          alt={email.name}
                        />
                        <AvatarFallback>{email.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {email.folder === "sent"
                            ? // @ts-expect-error
                              email.to || "Recipient"
                            : email.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {email.from}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(email.date).toLocaleDateString()}
                    </p>
                  </div>
                  <h3 className="text-sm font-medium mb-1">{email.subject}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {email.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No emails found</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Column - Email Details */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleStar(selectedEmail.id)}
                >
                  {selectedEmail.starred ? (
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteEmail(selectedEmail.id)}
                >
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="p-4 border-b">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40`}
                    alt={selectedEmail.name}
                  />
                  <AvatarFallback>
                    {selectedEmail.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedEmail.folder === "sent"
                      ? "You"
                      : selectedEmail.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmail.folder === "sent"
                      ? "To: " + (selectedEmail.to || "Recipient")
                      : "From: " + selectedEmail.from}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedEmail.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm">
                  {selectedEmail.content
                    .split("\n")
                    .map((line: string, i: number) => (
                      <p key={i} className="mb-2">
                        {line}
                      </p>
                    ))}
                </div>
              </div>

              {selectedEmail.folder !== "sent" && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setComposeEmail({
                        to: selectedEmail.from,
                        subject: `Re: ${selectedEmail.subject}`,
                        content: `\n\n-------- Original Message --------\nFrom: ${
                          selectedEmail.name
                        } <${selectedEmail.from}>\nDate: ${new Date(
                          selectedEmail.date
                        ).toLocaleString()}\nSubject: ${
                          selectedEmail.subject
                        }\n\n${selectedEmail.content}`,
                      });
                      setIsComposeOpen(true);
                    }}
                  >
                    Reply
                  </Button>
                </div>
              )}
            </div>

            <div className="p-4 border-b">
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
            </div>
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

      {/* Compose Email Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="to" className="text-sm font-medium">
                To:
              </label>
              <Input
                id="to"
                value={composeEmail.to}
                onChange={(e) =>
                  setComposeEmail({ ...composeEmail, to: e.target.value })
                }
                placeholder="recipient@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject:
              </label>
              <Input
                id="subject"
                value={composeEmail.subject}
                onChange={(e) =>
                  setComposeEmail({ ...composeEmail, subject: e.target.value })
                }
                placeholder="Email subject"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Message:
              </label>
              <Textarea
                id="content"
                value={composeEmail.content}
                onChange={(e) =>
                  setComposeEmail({ ...composeEmail, content: e.target.value })
                }
                placeholder="Write your message here..."
                rows={10}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSendEmail}
              disabled={!composeEmail.to || !composeEmail.subject}
            >
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog
        open={isNewFolderDialogOpen}
        onOpenChange={setIsNewFolderDialogOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="folderName" className="text-sm font-medium">
                Folder Name:
              </label>
              <Input
                id="folderName"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCreateFolder} disabled={!newFolder.trim()}>
              Create Folder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
