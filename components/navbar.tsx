"use client";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Kbd } from "@heroui/kbd";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Avatar } from "@heroui/react";

import { useUser } from "@/hooks/useUser";
import { useNavbar } from "@/hooks/useNavbar";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/loginForm";
import { siteConfig } from "@/config/site";

const links = siteConfig.navItems;
const accountLinks = siteConfig.accountLinks;

const searchInput = (
  <Input
    aria-label="Search"
    classNames={{
      inputWrapper: "bg-default-100",
      input: "text-sm",
    }}
    endContent={
      <Kbd className="hidden lg:inline-block" keys={["command"]}>
        K
      </Kbd>
    }
    labelPlacement="outside"
    placeholder="Search..."
    startContent={
      <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
    }
    type="search"
  />
);

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
          <NextLink
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
          </NextLink>
        </Section>
      ))}
    </>
  );
}

function AccountActions({
  handlerLogin,
  handlerLogout,
  handlerClickOutside,
}: {
  handlerLogin: ReturnType<typeof useNavbar>["handlerLogin"];
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
            className={hiddenOnMobile}
            variant="flat"
          >
            <DropdownItem
              key="user-info"
              className="h-14 gap-2"
              textValue={user.email}
            >
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user.email}</p>
            </DropdownItem>
            <>
              {accountLinks.map((item) => (
                <DropdownItem
                  key={item.label}
                  className="h-12"
                  textValue={item.label}
                  onClick={handlerClickOutside}
                >
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "w-full h-full",
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {<item.icon className="mr-2" size={18} />}
                    {item.label}
                  </NextLink>
                </DropdownItem>
              ))}
            </>
            <DropdownItem
              key="logout"
              className="h-12 text-red-500 hover:bg-red-50"
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
      <Button
        color="primary"
        size="lg"
        variant="outline"
        onClick={() => {
          handlerLogin();
          handlerClickOutside?.();
        }}
      >
        Login
      </Button>
    </NavbarItem>
  );
}

export default function Navbar() {
  const {
    isLoggingOpen,
    closeLogin,
    handlerLogin,
    handlerLogout,
    menuToggleRef,
    handleClickOutside,
  } = useNavbar();

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
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo />
              <p className="font-bold text-inherit">DEVTTER</p>
            </NextLink>
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
          <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
          <AccountActions
            handlerLogin={handlerLogin}
            handlerLogout={handlerLogout}
          />
        </NavbarContent>

        {/* MOBILE */}
        <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
          <ThemeSwitch />
          <NavbarMenuToggle ref={menuToggleRef} />
        </NavbarContent>

        {/* MOBILE MENU */}
        <NavbarMenu>
          {searchInput}
          <div className="mx-4 mt-2 flex flex-col gap-2">
            <NavLinks handlerClickOutside={handleClickOutside} />
            <AccountActions
              handlerClickOutside={handleClickOutside}
              handlerLogin={handlerLogin}
              handlerLogout={handlerLogout}
            />
          </div>
        </NavbarMenu>
      </HeroUINavbar>

      {isLoggingOpen && <LoginForm onClose={closeLogin} />}
    </>
  );
}
