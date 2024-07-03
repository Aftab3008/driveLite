"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { UploadIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadForm from "@/components/shared/UploadForm";

export default function Home() {
  const { user, isLoaded: UserLoaded, isSignedIn } = useUser();
  const { organization, isLoaded: OrgLoaded } = useOrganization();
  let orgId = null;
  if (OrgLoaded && UserLoaded) {
    orgId = organization?.id ?? user?.id;
  }
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const createFile = useMutation(api.files.createFile);

  return (
    <>
      <SignedOut>
        <main className="flex flex-col items-center justify-center p-24">
          <h1 className="text-4xl font-bold mb-4">Welcome to FileDrive</h1>
          <p className="text-lg text-gray-500">Sign in to see your files</p>
        </main>
      </SignedOut>
      <SignedIn>
        <main className="container mx-auto pt-12">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-1">Your Files</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UploadIcon className="mr-2" />
                  Upload File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="text-gray-1">Upload File</DialogTitle>
                <UploadForm />
              </DialogContent>
            </Dialog>
          </div>
          {files?.map((file) => <div key={file._id}>{file.name}</div>)}
        </main>
      </SignedIn>
    </>
  );
}
