"use client";

import type { IconProps } from "@iconify/react";
import dynamic from "next/dynamic";

const IconifyIcon = dynamic(() =>
  import("@iconify/react").then((mod) => mod.Icon)
);

export const Icon = ({ icon, ...props }: IconProps) => {
  return <IconifyIcon icon={icon} {...props} />;
};
