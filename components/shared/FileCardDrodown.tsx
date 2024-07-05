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
import {
  DownloadIcon,
  MoreVertical,
  Star,
  StarOff,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Doc } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Protect } from "@clerk/nextjs";

export default function ({ file }: { file: Doc<"files"> }) {
  const toggleFavourites = useMutation(api.files.toggleFavourite);
  const markAsDelete = useMutation(api.files.markAsDelete);
  const restoreFile = useMutation(api.files.restoreFile);
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
                  await markAsDelete({ fileId: file._id });
                  toast.success("File added to trash successfully");
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
          {!file.isDelete && (
            <DropdownMenuItem
              onClick={() => {
                window.open(file.fileUrl, "_blank");
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              <DownloadIcon className="w-4 h-4" />
              Download
            </DropdownMenuItem>
          )}
          {!file.isDelete && (
            <>
              <DropdownMenuSeparator />
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
            </>
          )}
          <Protect
            condition={(has) =>
              !has({ role: "org:member" }) || has({ role: "presonal:admin" })
            }
            fallback={null}
          >
            {file.isDelete ? (
              <DropdownMenuItem
                className="flex gap-1 text-green-600 items-center cursor-pointer  hover:text-green-400 focus:text-green-400"
                onClick={() => {
                  restoreFile({ fileId: file._id });
                }}
              >
                <UndoIcon className="w-4 h-4" />
                Restore
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex gap-1 text-red-600 items-center cursor-pointer  hover:text-red-400 focus:text-red-400"
                  onClick={() => setIsOpen(true)}
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
