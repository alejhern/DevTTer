"use client";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import Login42 from "@/components/loginForm";
import Searcher from "@/components/searcher";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { useNavbar } from "@/hooks/useNavbar";
import { useUser } from "@/hooks/useUser";
import Logo from "@/public/Devtter.png";

const links = siteConfig.navItems;
const accountLinks = siteConfig.accountLinks;

function NavLinks({
  handlerClickOutside,
}: {
  handlerClickOutside?: ReturnType<typeof useNavbar>["handleClickOutside"];
}) {
  const isMenu = Boolean(handlerClickOutside);
  const Section = isMenu ? NavbarMenuItem : NavbarItem;

  return (
    <>
      {links.map((item) => (
        <Section key={item.label}>
          <Link
            className={clsx(
              linkStyles({ color: "foreground" }),
              "data-[active=true]:text-primary data-[active=true]:font-medium",
            )}
            color="foreground"
            href={item.href}
            onClick={handlerClickOutside}
          >
            {<item.icon className="mr-2" size={18} />}
            {item.label}
          </Link>
        </Section>
      ))}
    </>
  );
}

function AccountActions({
  handlerLogout,
  handlerClickOutside,
}: {
  handlerLogout: ReturnType<typeof useNavbar>["handlerLogout"];
  handlerClickOutside?: ReturnType<typeof useNavbar>["handleClickOutside"];
}) {
  const user = useUser();
  const isMenu = Boolean(handlerClickOutside);
  const hiddenOnMobile = !isMenu ? "hidden lg:flex" : "flex";

  if (user) {
    return (
      <NavbarItem className="flex items-center">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-default-200 transition">
              <Avatar
                isBordered
                color="secondary"
                name={user.userName}
                size="sm"
                src={user.avatar}
              />
              <span className="font-medium hidden sm:inline">
                {user.userName}
              </span>
            </button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="User Menu"
            className={hiddenOnMobile + " bg-white dark:bg-black rounded-md "}
            variant="flat"
          >
            <DropdownItem
              key="user-info"
              className={clsx(linkStyles({ color: "primary" }), "h-14 p-2")}
              textValue={user.email}
            >
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>
            <>
              {accountLinks.map((item) => (
                <DropdownItem
                  key={item.label}
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "h-12",
                    "data-[active=true]:bg-default-100 data-[active=true]:text-primary",
                  )}
                  textValue={item.label}
                  onClick={handlerClickOutside}
                >
                  <Link
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "w-full h-full",
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {<item.icon className="mr-2" size={18} />}
                    {item.label}
                  </Link>
                </DropdownItem>
              ))}
            </>
            <DropdownItem
              key="logout"
              className={clsx(
                linkStyles({ color: "foreground" }),
                "h-12 text-red-500 bg-dark hover:bg-red-500 hover:text-white",
                "data-[active=true]:bg-red-500 data-[active=true]:text-white",
              )}
              textValue="Logout"
              onClick={() => {
                handlerLogout();
                handlerClickOutside?.();
              }}
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
    );
  }

  return (
    <NavbarItem>
      <Login42 />
    </NavbarItem>
  );
}

export default function Navbar() {
  const { handlerLogout, menuToggleRef, handleClickOutside } = useNavbar();

  return (
    <>
      <HeroUINavbar
        className="bg-default-100 border-b border-default-200"
        maxWidth="full"
        position="sticky"
      >
        {/* LEFT */}
        <NavbarContent className="basis-1/5 lg:basis-full" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link className="flex justify-start items-center gap-1" href="/">
              <Image
                priority
                alt="Devtter Logo"
                className="w-[60px] h-[60px]"
                height={60}
                src={Logo}
                width={60}
              />
              <p className="font-bold text-3xl">DEVTTER</p>
            </Link>
          </NavbarBrand>
          <div className="hidden lg:flex gap-4 justify-start ml-2">
            <NavLinks />
          </div>
        </NavbarContent>

        {/* CENTER / RIGHT */}
        <NavbarContent
          className="hidden lg:flex basis-1/5 lg:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden lg:flex gap-2">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <Searcher />
          </NavbarItem>
          <AccountActions handlerLogout={handlerLogout} />
        </NavbarContent>

        {/* MOBILE */}
        <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
          <ThemeSwitch />
          <NavbarMenuToggle ref={menuToggleRef} />
        </NavbarContent>

        {/* MOBILE MENU */}
        <NavbarMenu>
          <Searcher />
          <div className="mx-4 mt-2 flex flex-col gap-2">
            <NavLinks handlerClickOutside={handleClickOutside} />
            <AccountActions
              handlerClickOutside={handleClickOutside}
              handlerLogout={handlerLogout}
            />
          </div>
        </NavbarMenu>
      </HeroUINavbar>
    </>
  );
}
