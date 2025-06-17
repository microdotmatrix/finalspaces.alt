"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PlacidImage } from "@/lib/api/placid";
import { downloadImage } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ImagePollerProps {
  initialImageData: PlacidImage;
  id: number;
}

export function ImageResult({ initialImageData, id }: ImagePollerProps) {
  const [imageData, setImageData] = useState<PlacidImage | undefined>(
    initialImageData
  );
  const [isPolling, setIsPolling] = useState(
    initialImageData.status === "queued"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollImage = async () => {
      try {
        const response = await fetch(`/api/image/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }

        const data = await response.json();
        setImageData(data);

        if (data.status !== "queued") {
          setIsPolling(false);
        }
      } catch (err) {
        console.error("Error polling image:", err);
        setError("Failed to update image status");
        setIsPolling(false);
      }
    };

    if (isPolling) {
      // Poll every second
      intervalId = setInterval(pollImage, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id, isPolling]);

  if (error) {
    return (
      <Alert variant="destructive">
        <Icon icon="carbon:warning-alt" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (imageData?.status === "queued") {
    return (
      <Alert>
        <Icon icon="mdi:loading" className="animate-spin" />
        <AlertTitle>Image is processing</AlertTitle>
        <AlertDescription>
          {isPolling ? "..." : " (polling paused)"}
        </AlertDescription>
      </Alert>
    );
  }

  if (imageData?.status === "error") {
    return (
      <Alert variant="destructive">
        <Icon icon="carbon:warning-alt" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Error generating image</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto">
      {imageData?.image_url ? (
        <div className="border rounded-md overflow-hidden relative">
          <Image
            src={imageData.image_url}
            alt="Generated Epitaph"
            width={1200}
            height={1200}
            priority
            className="w-full h-auto object-contain"
          />

          <div className="absolute top-2 right-2 z-10 flex flex-col items-center justify-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  asChild
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    downloadImage(
                      imageData?.image_url,
                      `epitaph-${imageData?.id}`
                    )
                  }
                  className="p-2.5 lg:p-2 bg-accent/80 rounded-sm border-accent"
                >
                  <Icon
                    icon="carbon:download"
                    className="size-full text-muted-foreground"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <span>Download Image</span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  asChild
                  size="icon"
                  variant="outline"
                  className="p-2.5 lg:p-2 bg-accent/80 rounded-sm border-accent"
                  onClick={() => {
                    navigator.clipboard.writeText(imageData?.image_url);
                    toast("Image URL copied to clipboard");
                  }}
                >
                  <Icon
                    icon="carbon:copy"
                    className="size-full text-muted-foreground"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <span>Copy Image URL</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-100">Image URL not available</div>
      )}
    </div>
  );
}
