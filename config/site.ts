export type SiteConfig = typeof siteConfig;

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Timeline",
    href: "/timeline",
  },
];

const accountLinks = [
  {
    label: "Profile",
    href: "/profile",
  },
  {
    label: "Add Devit",
    href: "/compose/devit",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

export const siteConfig = {
  navItems: navItems,
  navMenuItems: navItems,
  accountLinks: accountLinks,
};
