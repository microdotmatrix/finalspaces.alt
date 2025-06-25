"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

interface AnimatedInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: "text" | "textarea" | "url" | "email" | "number";
  required?: boolean;
  placeholder?: string;
}

export function AnimatedInput({
  name,
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  required = false,
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const labelVariants = {
    default: {
      y: 0,
      scale: 1,
      color: "var(--color-muted-foreground)",
      originX: 0,
    },
    focused: {
      y: -29,
      scale: 0.85,
      color: "var(--color-foreground)",
      originX: 0,
    },
  };

  const isActive = isFocused || value !== "";

  const inputClasses =
    "outline-none focus:border-transparent transition-all placeholder:opacity-0 focus:placeholder:opacity-100 placeholder:transition-all placeholder:duration-200 placeholder:delay-100 placeholder:ease-in-out placeholder:translate-x-3 focus:placeholder:translate-x-0 placeholder:blur-sm focus:placeholder:blur-none";

  return (
    <div className="relative">
      <motion.label
        htmlFor={name}
        className="absolute left-3 top-3 pointer-events-none text-sm"
        initial="default"
        animate={isActive ? "focused" : "default"}
        variants={labelVariants}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>

      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(inputClasses, "h-32")}
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <Input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(inputClasses, "h-10")}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
