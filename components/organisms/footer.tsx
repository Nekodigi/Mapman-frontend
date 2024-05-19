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
import { ImageDL } from "../dialogs/imageDL";
import { Suspense, useMemo } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const current = useMemo(() => {
    return pathname.split("/")[1];
  }, [pathname]);

  return (
    <footer className="">
      <NavigationMenu className="max-w-full">
        <Button url="/map">
          <Map strokeWidth={1.5} opacity={current === "map" ? 1 : 0.5} />
        </Button>
        <Button url="/document">
          <FileText
            strokeWidth={1.5}
            opacity={current === "document" ? 1 : 0.5}
          />
        </Button>
        {/* <Button url="/ask">
          <MessageSquareMore
            strokeWidth={1.5}
            opacity={current === "ask" ? 1 : 0.5}
          />
        </Button> */}
        <SettingsDL />
        <Suspense>
          <ImageDL />
        </Suspense>
      </NavigationMenu>
    </footer>
  );
};
