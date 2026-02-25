export type SiteConfig = typeof siteConfig;

import { Home, Clock, User, PlusSquare, Settings } from "lucide-react";

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
