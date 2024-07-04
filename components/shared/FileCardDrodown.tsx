import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, TrashIcon } from "lucide-react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export default function ({ fileId }: { fileId: Id<"files"> }) {
  const deleteFile = useMutation(api.files.deleteFile);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="focus:ring-0 focus:outline-none focus-visible:ring-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await deleteFile({
                    fileId,
                  });
                  toast.success("File deleted successfully");
                } catch (error) {
                  toast.error("Error deleting file");
                }
              }}
              className="bg-blue-1 hover:bg-blue-1/80"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:ring-0 focus:outline-none focus-visible:ring-0">
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-1 text-red-600 items-center cursor-pointer  hover:text-red-400 focus:text-red-400"
            onClick={() => setIsOpen(true)}
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
