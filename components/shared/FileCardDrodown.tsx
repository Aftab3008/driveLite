import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { MoreVertical, Star, StarOff, TrashIcon } from "lucide-react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Protect } from "@clerk/nextjs";

export default function ({ file }: { file: Doc<"files"> }) {
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFavourites = useMutation(api.files.toggleFavourite);
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
                    fileId: file._id,
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
            className="flex gap-1  items-center cursor-pointer "
            onClick={() => {
              toggleFavourites({ fileId: file._id });
            }}
          >
            {file.isFav ? (
              <>
                <StarOff className="w-4 h-4" />
                Unfavourite
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                Favourites
              </>
            )}
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={null}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-1 text-red-600 items-center cursor-pointer  hover:text-red-400 focus:text-red-400"
              onClick={() => setIsOpen(true)}
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
