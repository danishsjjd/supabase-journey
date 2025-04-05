import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FolderPlus } from "lucide-react";
import { useState } from "react";

const NewFolderDialog = () => {
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolder, setNewFolder] = useState("");

  //   TODO: handleCreateFolder
  const handleCreateFolder = () => {};

  return (
    <Dialog
      open={isNewFolderDialogOpen}
      onOpenChange={setIsNewFolderDialogOpen}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FolderPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
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
  );
};

export default NewFolderDialog;
