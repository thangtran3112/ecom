/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}
