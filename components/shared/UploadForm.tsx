import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { Id } from "@/convex/_generated/dataModel";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  file: z.instanceof(File, {
    message: "Required",
  }),
});

export default function UploadForm({
  orgId,
  setIsDialogOpen,
}: {
  orgId: string | null | undefined;
  setIsDialogOpen: (value: boolean) => void;
}) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const createFile = useMutation(api.files.createFile);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    form.setValue("file", file as File);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;
    try {
      const uploaded = await startUpload([values.file]);
      if (!uploaded) {
        toast.error("Failed to upload file");
        return;
      }
      const storageId = (
        uploaded[0] as { response: { storageId: Id<"_storage"> } }
      ).response.storageId;
      const id = await createFile({
        name: values.title,
        fileId: storageId,
        orgId: orgId!,
      });
      if (!id) {
        toast.error("Error creating file");
        return;
      }
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Error uploading file");
      handleError(error);
    } finally {
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="focus-visible:ring-2 focus-visible:ring-blue-1 focus-visible:ring-offset-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select file</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  className="cursor-pointer  py-2 px-4  rounded-md shadow-sm  transition duration-300 ease-in-out"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          className="bg-blue-1 hover:bg-blue-1/90 hover:text-white"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader className="animate-spin mr-2" color="white" />
              Uploading
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </form>
    </Form>
  );
}
