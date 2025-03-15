"use client"

import { Link } from "@heroui/link";
import { Navbar as HeroUINavbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/navbar";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
import { BookText } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { motion } from "framer-motion";
import { WalletComponents } from "./wallet";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <HeroUINavbar maxWidth="full" position="static" className="bg-transparent backdrop-saturate-100 z-[100]" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="basis-1/5 xl:basis-full hidden xl:flex xl:flex-row items-center backdrop-blur-sm" justify="start">
        <Link href="/home" title="Home">
          <Image src="/logo.png" alt="logo" className="min-w-11 min-h-11 w-11 h-11 rounded-full ring-1 p-1 ring-gray-600" width={50} height={50} />
        </Link>
        <div className="relative flex items-center border border-gray-600 rounded-full w-fit">
          <div className="realtive flex p-1">
            {siteConfig.navItems.map((item) => (
              <NavbarItem
                key={item.href}
                className="relative navbar-item"
              >
                <Link
                  className={clsx(
                    "text-sm font-normal px-4 py-2 rounded-full",
                    pathname === item.href ? "text-background" : "text-foreground"
                  )}
                  href={item.href}
                >
                  {pathname === item.href && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 z-10 bg-foreground mix-blend-difference"
                      style={{ borderRadius: 9999 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="z-10">{item.label}</span>
                </Link>
              </NavbarItem>
            ))}
          </div>
        </div>
      </NavbarContent>

      <NavbarContent className="hidden xl:flex basis-1/5 xl:basis-full mb-4" justify="end">
        <NavbarItem className="hidden xl:flex gap-4">
          <Link isExternal href={siteConfig.links.docs} title="Docs">
            <BookText className="text-default-500 h-5 w-5" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <WalletComponents />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="xl:hidden basis-1 pl-4">
        <div className="flex justify-between items-center w-full">
          <NavbarMenuToggle className="p-5 -ml-5" />
          <div className="flex flex-row gap-3">
            <Link isExternal href={siteConfig.links.docs} title="Docs">
              <BookText className="text-default-500 h-5 w-5" />
            </Link>
            <Link isExternal href={siteConfig.links.github} title="GitHub">
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
          </div>
        </div>
      </NavbarContent>

      <NavbarMenu className="z-20 absolute inset-0 full-height bg-background/50">
        <div className="mx-4 flex-col gap-5 flex-grow inline-flex justify-between py-10">
          <div className="inline-flex flex-col gap-5">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={clsx(
                    "border-l-2 pl-5 h-10",
                    pathname === item.href ? "border-primary text-primary" : "border-transparent"
                  )}
                  color="foreground"
                  href={item.href}
                  size="lg"
                  onPress={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
          <WalletComponents />
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
