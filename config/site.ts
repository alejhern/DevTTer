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
    color: "#f7df1e",
  },
  typescript: {
    name: "TypeScript",
    type: "frontend",
    color: "#3178c6",
  },
  html: {
    name: "HTML",
    type: "iframe",
    color: "#e34c26",
  },
  python: {
    name: "Python",
    type: "backend",
    color: "#3572A5",
  },
  java: {
    name: "Java",
    type: "backend",
    color: "#b07219",
  },
  bash: {
    name: "Bash",
    type: "backend",
    color: "#89e051",
  },
  c: {
    name: "C",
    type: "backend",
    color: "#555555",
  },
  cpp: {
    name: "C++",
    type: "backend",
    color: "#f34b7d",
  },
  ruby: {
    name: "Ruby",
    type: "backend",
    color: "#701516",
  },
  php: {
    name: "PHP",
    type: "backend",
    color: "#4F5B9D",
  },
};
