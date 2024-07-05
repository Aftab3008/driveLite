import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "@/convex/_generated/dataModel";
import FileCardDrodown from "./FileCardDrodown";
import { formatRelative, subDays } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mimeTypeIcons } from "@/constants";
import { faFile, faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getLastName } from "@/lib/utils";

export default function FileCard({ file }: { file: Doc<"files"> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="text-blue-1 flex gap-2 text-base font-normal">
          <FontAwesomeIcon
            icon={mimeTypeIcons[file.type] || faFile}
            className="w-5 h-5"
          />
          {file.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardDrodown file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type.toLowerCase().includes("image") && (
          <Image
            src={file.fileUrl}
            alt={file.name}
            width={200}
            height={100}
            className="rounded-2xl"
            loading="lazy"
          />
        )}
        {!file.type.toLowerCase().includes("image") && (
          <FontAwesomeIcon
            icon={mimeTypeIcons[file.type] || faFile}
            className="w-20 h-20"
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex gap-2 text-xs text-gray-1 w-40 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.imageUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-1 flex justify-between items-center gap-2">
          Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
          {file.isFav && (
            <FontAwesomeIcon icon={faStar} className="w-6 h-6 text-blue-1" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
