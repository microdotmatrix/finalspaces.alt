"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { useState } from "react";

interface AnimatedInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}

export function AnimatedInput({
  name,
  label,
  value,
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

      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="outline-none focus:border-transparent transition-all h-10"
        required={required}
      />
    </div>
  );
}
