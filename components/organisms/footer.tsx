"use client";

import { Map, FileText, MessageSquareMore } from "lucide-react";
import Link from "next/link";

import { SettingsDL } from "../dialogs/settingsDL";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type ButtonProps = {
  url: string;
  children: React.ReactNode;
};

const Button = ({ url, children }: ButtonProps) => {
  return (
    <NavigationMenuList>
      <NavigationMenuItem>
        <Link href={url} legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {children}
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
};

export const Footer = () => {
  return (
    <footer className="">
      <NavigationMenu className="max-w-full">
        <Button url="/map">
          <Map />
        </Button>
        <Button url="/document">
          <FileText />
        </Button>
        <Button url="/ask">
          <MessageSquareMore />
        </Button>
        <SettingsDL />
      </NavigationMenu>
    </footer>
  );
};
