export type SiteConfig = typeof siteConfig;

import { Clock, Home, PlusSquare, Settings, User } from "lucide-react";

const iconMap = {
  home: Home,
  timeline: Clock,
  profile: User,
  add: PlusSquare,
  settings: Settings,
};

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: iconMap.home,
  },
  {
    label: "Timeline",
    href: "/timeline",
    icon: iconMap.timeline,
  },
];

const accountLinks = [
  {
    label: "Profile",
    href: "/profile",
    icon: iconMap.profile,
  },
  {
    label: "Add Devit",
    href: "/compose/devit",
    icon: iconMap.add,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: iconMap.settings,
  },
];

export const siteConfig = {
  navItems: navItems,
  navMenuItems: navItems,
  accountLinks: accountLinks,
};

export const supportedLanguages = {
  javascript: {
    name: "JavaScript",
    type: "frontend",
  },
  typescript: {
    name: "TypeScript",
    type: "frontend",
  },
  html: {
    name: "HTML",
    type: "iframe",
  },
  python: {
    name: "Python",
    type: "backend",
  },
  java: {
    name: "Java",
    type: "backend",
  },
  c: {
    name: "C",
    type: "backend",
  },
  cpp: {
    name: "C++",
    type: "backend",
  },
  ruby: {
    name: "Ruby",
    type: "backend",
  },
  php: {
    name: "PHP",
    type: "backend",
  },
};
