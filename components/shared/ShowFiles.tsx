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
import { AlertCircle, GridIcon, Rows3Icon } from "lucide-react";
import { DataTable } from "./FileTable";
import { columns } from "./Cloumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [type, setType] = useState("all");
  const deboundedQuery = useDebounce(query, 500);

  let orgId = null;
  if (OrgLoaded && UserLoaded) {
    orgId = organization?.id ?? user?.id;
  }
  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          query: deboundedQuery,
          favourites: isFav,
          delete: isDelete,
          type: type === "all" ? undefined : type,
        }
      : "skip"
  );

  return (
    <>
      <div className="flex justify-between items-center mb-7">
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

      <>
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="grid" className="flex gap-2 items-center">
                <GridIcon />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex gap-2 items-center">
                <Rows3Icon />
                Table
              </TabsTrigger>
            </TabsList>
            <div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[180px] focus-visible:ring-2 focus-visible:ring-blue-1 focus-visible:ring-offset-2">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {files ? (
            <>
              {files.length === 0 && <Placeholder />}
              <TabsContent value="grid">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-8">
                  {files.length > 0 &&
                    files?.map((file) => (
                      <FileCard file={file} key={file._id} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="table">
                <DataTable columns={columns} data={files} />
              </TabsContent>
            </>
          ) : (
            <div className="flex flex-col gap-8 w-full items-center mt-24">
              <LoadingSpinner size="sm" classes="h-10 w-10" />
            </div>
          )}
        </Tabs>
      </>
    </>
  );
}
