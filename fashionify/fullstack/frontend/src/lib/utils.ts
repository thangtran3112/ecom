/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Safe classnames merge function
 * This is normally used in headless UI components like Shadcn UI
 * This function is used to merge classnames without worrying about undefined values
 * @param inputs The classes to be merged
 * @returns
 */
export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}
