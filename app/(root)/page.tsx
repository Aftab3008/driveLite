"use client";

import { api } from "@/convex/_generated/api";
import { SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import UploadForm from "@/components/shared/UploadForm";
import FileCard from "@/components/shared/FileCard";
import Image from "next/image";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useState } from "react";
import { useDebounce } from "@/lib/useDebounce";
import SearchBar from "@/components/shared/SearchBar";

export default function Home() {
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
    orgId ? { orgId, query: deboundedQuery } : "skip"
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-1">
          Your Files
        </h1>
        <SearchBar query={query} setQuery={setQuery} />
        <UploadForm orgId={orgId} />
      </div>
      {files ? (
        <>
          {files.length === 0 && <PlaceHolder />}
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

function PlaceHolder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        src="/images/addfiles.svg"
        alt="Add File"
        width={300}
        height={300}
      />
      <h2 className="text-2xl text-gray-1">
        No files found, upload files to see
      </h2>
    </div>
  );
}
