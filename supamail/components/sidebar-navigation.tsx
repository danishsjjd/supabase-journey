"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/use-app";
import { LogOut } from "lucide-react";
import ComposeEmailDialog from "./compse-email-dialog";
import NewFolderDialog from "./new-folder-dialog";

const SidebarNavigation = () => {
  const { folders } = useApp();

  return (
    <div className="w-64 border-r bg-muted/20 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <form method="post" action="/auth/signout">
          <Button variant="ghost" size="sm" type="submit">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </form>
      </div>

      <ComposeEmailDialog />
      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Folders</h3>
          <NewFolderDialog />
        </div>
        <ul className="space-y-1">
          {folders.map((folder) => (
            <li key={folder.id}>
              <Button className="w-full justify-start text-sm">
                {folder.name}
                <Badge variant="outline" className="ml-auto">
                  {/* // TODO: number of emails in folder */}0
                </Badge>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarNavigation;
