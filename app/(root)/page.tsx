"use client";

import { api } from "@/convex/_generated/api";
import { SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import UploadForm from "@/components/shared/UploadForm";
import FileCard from "@/components/shared/FileCard";
import Image from "next/image";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function Home() {
  const { user, isLoaded: UserLoaded } = useUser();
  const { organization, isLoaded: OrgLoaded } = useOrganization();
  let orgId = null;
  if (OrgLoaded && UserLoaded) {
    orgId = organization?.id ?? user?.id;
  }
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <>
      <SignedOut>
        <main className="flex flex-col items-center justify-center p-24">
          <h1 className="text-4xl font-bold mb-4">Welcome to FileDrive</h1>
          <p className="text-lg text-gray-500">Sign in to see your files</p>
        </main>
      </SignedOut>
      <SignedIn>
        <>
          <main className="container mx-auto pt-12">
            {files === undefined && (
              <div className="flex flex-col gap-8 w-full items-center mt-24">
                <LoadingSpinner size="sm" classes="h-10 w-10" />
              </div>
            )}
            {files && files.length === 0 && (
              <div className="flex flex-col gap-8 w-full items-center mt-24">
                <Image
                  src="/images/addfiles.svg"
                  alt="Add File"
                  width={300}
                  height={300}
                />
                <h2 className="text-2xl text-gray-1">
                  You have no files,upload files to see
                </h2>
                <UploadForm orgId={orgId} />
              </div>
            )}
            {files && files.length > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-bold text-gray-1">Your Files</h1>
                  <UploadForm orgId={orgId} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-8">
                  {files?.map((file) => (
                    <FileCard file={file} key={file._id} />
                  ))}
                </div>
              </>
            )}
          </main>
        </>
      </SignedIn>
    </>
  );
}
