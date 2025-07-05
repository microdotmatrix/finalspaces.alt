"use client";

import { UserThumbnails } from "@/components/auth/user/thumbnails";
import { AnimatedInput } from "@/components/elements/form/animated-input";
import { FileUpload } from "@/components/media/uploads/file";
import { useUploadThing } from "@/components/media/uploads/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PlacidRequest } from "@/lib/api/placid";
import { cn } from "@/lib/utils";
import type { Upload } from "@/types/media";
import type { UnifiedQuote } from "@/types/quotes";
import type { ActionState } from "@/types/state";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function CreateImage({
  action,
  userId,
  uploads,
  quotes,
}: {
  action: (formData: PlacidRequest, userId: string) => Promise<ActionState>;
  userId: string;
  uploads: Upload[];
  quotes: UnifiedQuote[];
}) {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [selectImage, setSelectImage] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>();
  const [deathDate, setDeathDate] = useState<Date>();
  const [visibleUploads, setVisibleUploads] = useState(6);
  const [openQuotes, setOpenQuotes] = useState(false);
  const [formData, setFormData] = useState<PlacidRequest>({
    name: "",
    epitaph: "",
    citation: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      if (result.error) {
        setError(result.error);
        return;
      }
      startTransition(() => {
        router.push(`/memorials/create?id=${result.result}`);
      });
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
          placeholder="What was their name?"
          required
        />

        <div className="relative">
          <AnimatedInput
            name="epitaph"
            label="Epitaph"
            type="textarea"
            value={formData.epitaph}
            onChange={handleChange}
            placeholder="Is there a quote or phrase you'd like to remember them by?"
            required
          />
          {quotes && quotes.length > 0 && (
            <Dialog open={openQuotes} onOpenChange={setOpenQuotes}>
              <div className="absolute right-2 bottom-2 z-10 flex items-center gap-2">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Choose from saved quotes"
                  >
                    <Icon icon="carbon:quotes" className="size-3" />
                  </Button>
                </DialogTrigger>
                <Button
                  variant="outline"
                  size="icon"
                  title="Reset quote"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      epitaph: "",
                      citation: "",
                    }))
                  }
                >
                  <Icon icon="carbon:reset" className="size-3" />
                </Button>
              </div>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base flex items-center gap-2">
                    <Icon icon="mdi:bookmark-outline" className="size-6" />
                    Select a quote
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {quotes.map((quote, index) => (
                      <div
                        key={index}
                        className="p-4 space-y-4 border rounded-md cursor-pointer hover:bg-card/75 shadow-lg hover:shadow-teal-500/10 transition-colors"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            epitaph: quote.quote,
                            citation: quote.author,
                          }));
                          setOpenQuotes(false);
                          toast.success("Quote selected");
                        }}
                      >
                        <p className="text-sm italic">"{quote.quote}"</p>
                        <p className="text-sm font-medium">{quote.author}</p>
                      </div>
                    ))}
                    {quotes.length === 0 && (
                      <div className="text-center py-8">
                        <Icon
                          icon="carbon:quotes"
                          className="size-12 mb-4 text-muted-foreground mx-auto"
                        />
                        <p className="text-muted-foreground">
                          No saved quotes found
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Link
                    href="/quotes"
                    className={buttonVariants({ variant: "default" })}
                  >
                    Search Quotes
                  </Link>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <AnimatedInput
          name="citation"
          label="Citation"
          value={formData.citation}
          onChange={handleChange}
          placeholder="Who said it?"
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
            <div className={cn("grid grid-cols-3 gap-1.5")}>
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
                citation: "",
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
