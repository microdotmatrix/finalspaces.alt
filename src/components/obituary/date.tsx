"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export const DatePicker = ({
  date,
  onDateChange,
  placeholder = "Select date",
  error,
}: {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  error?: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal items-center-safe",
          !date && "text-muted-foreground",
          error && "border-destructive"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : placeholder}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0 text-xs">
      <Calendar
        mode="single"
        captionLayout="dropdown"
        selected={date}
        onSelect={onDateChange}
      />
    </PopoverContent>
  </Popover>
);
