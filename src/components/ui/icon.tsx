"use client";

import type { IconProps } from "@iconify/react";
import { Icon as IconifyIcon } from "@iconify/react";

export const Icon = ({ icon, ...props }: IconProps) => {
  return <IconifyIcon icon={icon} {...props} />;
};
