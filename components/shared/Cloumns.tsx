"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { capitalizeFirstLetterIfNotDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { formatRelative } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import FileCardDrodown from "./FileCardDrodown";

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, { userId });
  return (
    <div className="flex gap-2 text-xs text-gray-1 w-40 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.imageUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  );
}

export const columns: ColumnDef<Doc<"files">>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "Uploaded By",
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />;
    },
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => {
      return (
        <div>
          {capitalizeFirstLetterIfNotDate(
            formatRelative(new Date(row.original._creationTime), new Date())
          )}
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return <FileCardDrodown file={row.original} />;
    },
  },
];
