import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Send } from "lucide-react";
import { useState } from "react";

const ComposeEmailDialog = () => {
  const [composeEmail, setComposeEmail] = useState({
    to: "",
    subject: "",
    content: "",
  });

  // TODO: handleSendEmail
  const handleSendEmail = () => {
    setComposeEmail({ to: "", subject: "", content: "" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mb-4">
          <PlusCircle className="mr-2 h-4 w-4" /> Compose
        </Button>
      </DialogTrigger>
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
              placeholder="recipient@example.com, recipient@acme.com"
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
  );
};

export default ComposeEmailDialog;
