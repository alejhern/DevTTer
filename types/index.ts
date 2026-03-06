import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  id: string;
  userName: string;
  name: string;
  email: string;
  avatar: string;
}

export interface CodeSnippet {
  language: string;
  content: string;
}

export interface Comment {
  id: string;
  comment: string;
  user: User;
  code?: CodeSnippet;
  createdAt: Date;
}

export interface Devit {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  code: CodeSnippet;
  imageUrl?: string;
  likes?: Array<string>;
  comments?: Array<Comment> | Number;
  reDevs?: number;
}
