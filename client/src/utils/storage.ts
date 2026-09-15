import { CONFIG } from "@/config/app";

export default function Storage(url: string) {
  return `${CONFIG.STORAGE}/${url}`;
}
