import { SVGProps } from "react";

import { supportedLanguages } from "@/config/site";

export type LanguagesKey = keyof typeof supportedLanguages;

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  id: string;
  userName: string;
  name: string;
  avatar: string;
  email?: string;
  lastLogin?: Date | string;
}

export interface CodeSnippet {
  language: LanguagesKey;
  content: string;
}

export interface Comment {
  id: string;
  comment: string;
  author: string;
  code?: CodeSnippet;
  createdAt: Date;
}

export interface Devit {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  code: CodeSnippet;
  imageUrl?: string;
  likes?: Array<string>;
  comments?: Array<Comment> | Number;
  reDevs?: number;
}

export interface PostDevit {
  devit: Devit;
  author: User;
}

export interface Message {
  id: string;
  content: string;
  code?: CodeSnippet;
  sender?: User;
  receiver?: User;
  createdAt: Date;
}

export interface Conversation {
  receiver: User;
  lastMessage: Message;
}

type Status = "idle" | "running" | "done" | "error";

export interface UIState {
  copied: boolean;
  fullScreen: boolean;
  output: string;
  status: Status;
  showOutput: boolean;
}

export type UIAction =
  | { type: "COPY_START" }
  | { type: "COPY_RESET" }
  | { type: "FULLSCREEN_TOGGLE" }
  | { type: "FULLSCREEN_EXIT" }
  | { type: "RUN_START" }
  | { type: "RUN_DONE"; payload: string }
  | { type: "RUN_ERROR"; payload: string }
  | { type: "OUTPUT_CLOSE" };

export const UKNOWN_USER: User = {
  id: "unknown",
  userName: "unknown",
  name: "Unknown User",
  email: "",
  avatar: "https://api.dicebear.com/9.x/bottts/png?seed=Unknown",
};
