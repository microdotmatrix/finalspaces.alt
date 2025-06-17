"use client";

import { UserThumbnails } from "@/components/auth/user/thumbnails";
import { AnimatedInput } from "@/components/elements/form/animated-input";
import { FileUpload } from "@/components/media/uploads/file";
import { useUploadThing } from "@/components/media/uploads/utils";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import type { ActionState } from "@/lib/api/actions";
import type { PlacidRequest } from "@/lib/api/placid";
import { cn } from "@/lib/utils";
import type { Upload } from "@/types/media";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function CreateImage({
  action,
  userId,
  uploads,
}: {
  action: (formData: PlacidRequest, userId: string) => Promise<ActionState>;
  userId: string;
  uploads: Upload[];
}) {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectImage, setSelectImage] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const [deathDate, setDeathDate] = useState<Date>();
  const [visibleUploads, setVisibleUploads] = useState(6);
  const [formData, setFormData] = useState<PlacidRequest>({
    name: "",
    epitaph: "",
    birth: birthDate ? format(birthDate, "MMMM d, yyyy") : "",
    death: deathDate ? format(deathDate, "MMMM d, yyyy") : "",
    portrait: "",
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (data) => {
      setFormData((prev) => ({ ...prev, portrait: data[0].ufsUrl }));
      setSelectImage(true);
      setUploadComplete(true);
      toast("File uploaded successfully");
      router.refresh();
    },
    onUploadError: (error) => {
      console.log(error);
      toast(error.message);
    },
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      if (!selectImage || formData.portrait === "") {
        toast("Please select or upload a file");
        return;
      }
      const result = await action(formData, userId);
      console.log(result);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/memorials/create?id=${result.result}`);
    });
  };

  return (
    <div className="w-full max-w-lg p-6 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatedInput
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <AnimatedInput
          name="epitaph"
          label="Epitaph"
          value={formData.epitaph}
          onChange={handleChange}
          required
        />

        <div className="flex items-center gap-4">
          <DatePicker
            date={birthDate}
            setDate={(date) => {
              setBirthDate(date);
              setFormData((prev) => ({
                ...prev,
                birth: date ? format(date, "MMMM d, yyyy") : "",
              }));
            }}
            width="flex-1 h-10"
            label="Date of Birth"
          />
          <DatePicker
            date={deathDate}
            setDate={(date) => {
              setDeathDate(date);
              setFormData((prev) => ({
                ...prev,
                death: date ? format(date, "MMMM d, yyyy") : "",
              }));
            }}
            width="flex-1 h-10"
            label="Date of Death"
          />
        </div>

        <FileUpload
          onChange={startUpload}
          isUploading={isUploading}
          uploadComplete={uploadComplete}
        />

        {uploads && uploads.length > 0 && (
          <div className="space-y-3">
            <span className="text-sm font-semibold">Previous uploads:</span>
            <div className="columns-3 gap-1.5">
              {[...uploads]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, visibleUploads)
                .map((file) => (
                  <div
                    key={file.id}
                    onClick={() => {
                      setSelectImage(true);
                      setFormData({ ...formData, portrait: file.url });
                    }}
                    className={cn(
                      "cursor-pointer mb-1.5 hover:ring ring-primary hover:ring-primary transition-all",
                      formData.portrait === file.url &&
                        "ring focus:ring-primary active:ring-primary"
                    )}
                  >
                    <UserThumbnails
                      key={file.id}
                      file={{
                        id: file.id,
                        url: file.url,
                        name: file.fileName,
                        createdAt: file.createdAt,
                        key: file.storageKey,
                      }}
                    />
                  </div>
                ))}
            </div>
            {uploads.length > visibleUploads && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setVisibleUploads((prev) => prev + 6)}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
        {selectImage && (
          <input
            type="hidden"
            name="portrait"
            value={formData.portrait}
            onChange={handleChange}
          />
        )}

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            type="submit"
            className="flex-1 w-full sm:w-auto"
            disabled={isPending}
          >
            Generate Image
          </Button>
          <Button
            type="reset"
            variant="outline"
            className="flex-1 w-full sm:w-auto"
            onClick={() => {
              setFormData({
                name: "",
                epitaph: "",
                birth: "",
                death: "",
                portrait: "",
              });
              setUploadComplete(false);
              setBirthDate(undefined);
              setDeathDate(undefined);
              setError(null);
              setSelectImage(false);
              router.replace("/memorials/create");
            }}
          >
            Reset
          </Button>
        </div>
        {error && <p className="text-destructive">{error}</p>}
      </form>
    </div>
  );
}
