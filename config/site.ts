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

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: navItems,
  navMenuItems: navItems,
};

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
