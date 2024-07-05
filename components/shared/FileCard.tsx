import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import FileCardDrodown from "./FileCardDrodown";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mimeTypeIcons } from "@/constants";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function FileCard({ file }: { file: Doc<"files"> }) {
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="text-blue-1 flex gap-2">
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
      <CardFooter>
        <Button
          className="bg-blue-1 text-white hover:bg-blue-1/90"
          onClick={() => {
            window.open(file.fileUrl, "_blank");
          }}
          disabled={!file.fileUrl}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
