import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function getTimeAgo(date: Date) {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}sec`;
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}hours`;

  const days = Math.floor(hours / 24);

  return `${days}days`;
}
