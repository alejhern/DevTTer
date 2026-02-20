import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  id: string;
  userName: string;
  name: string;
  email: string;
  photoURL: string;
}

export interface Devit {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  code?: {
    language: string;
    content: string;
  };
  imageUrl?: string;
}
