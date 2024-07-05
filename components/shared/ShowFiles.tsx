"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import UploadForm from "@/components/shared/UploadForm";
import FileCard from "@/components/shared/FileCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useState } from "react";
import { useDebounce } from "@/lib/useDebounce";
import SearchBar from "@/components/shared/SearchBar";
import Placeholder from "./Placeholder";
import { AlertCircle } from "lucide-react";

export default function ShowFiles({
  title,
  isFav,
  isDelete,
}: {
  title: string;
  isFav?: boolean;
  isDelete?: boolean;
}) {
  const { user, isLoaded: UserLoaded } = useUser();
  const { organization, isLoaded: OrgLoaded } = useOrganization();
  const [query, setQuery] = useState("");
  const deboundedQuery = useDebounce(query, 500);

  let orgId = null;
  if (OrgLoaded && UserLoaded) {
    orgId = organization?.id ?? user?.id;
  }
  const files = useQuery(
    api.files.getFiles,
    orgId
      ? { orgId, query: deboundedQuery, favourites: isFav, delete: isDelete }
      : "skip"
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-1 mr-2">
          {title}
        </h1>
        <SearchBar query={query} setQuery={setQuery} />
        {!isDelete ? (
          <UploadForm orgId={orgId} />
        ) : (
          <p className="text-xs font-bold text-blue-1">
            <AlertCircle className="h-4 w-4 inline-block mr-2" />
            Files will be deleted in 30days
          </p>
        )}
      </div>
      {files ? (
        <>
          {files.length === 0 && <Placeholder />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-8">
            {files.length > 0 &&
              files?.map((file) => <FileCard file={file} key={file._id} />)}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <LoadingSpinner size="sm" classes="h-10 w-10" />
        </div>
      )}
    </>
  );
}
