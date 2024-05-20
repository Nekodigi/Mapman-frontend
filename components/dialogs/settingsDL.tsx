import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useMemo, useState } from "react";

import { AccountContext } from "../context/account";
import { Button } from "../ui/button";

import { ThemeToggle } from "@/components/atoms/themeToggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { ProfileMenu } from "./profileDL";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export const SettingsDL = () => {
  const account = useContext(AccountContext);
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const current = useMemo(() => {
    return pathname.split("/")[1];
  }, [pathname]);

  const open = useMemo(() => {
    return params.get("openSettings") === "true";
  }, [params]);

  const setOpen = useCallback((open: boolean) => {
    console.log(open);
    if (open) {
      window.history.pushState({}, "", "/settings?openSettings=true");
    } else {
      router.back();
    }
  }, []);

  //TODO theme, profile, account
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        console.log(open);
        setOpen(open);
      }}
    >
      <DialogTrigger className="px-4" asChild>
        <Button
          variant="ghost"
          className="flex justify-center items-center py-0 px-2"
        >
          {session?.user?.image && (
            <Avatar className="flex justify-center items-center">
              <AvatarImage
                src={session?.user?.image}
                alt={
                  session?.user?.email?.substring(0, 2).toUpperCase() ||
                  "not logged in"
                }
                className="rounded-full w-8 h-8"
              />
              <AvatarFallback>{session?.user?.email}</AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Theme</Label>
          <ThemeToggle />
        </div>
        <ProfileMenu parentSetOpen={setOpen} />
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Account</Label>
          {status === "authenticated" ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                {session?.user?.image && (
                  <Avatar>
                    <AvatarImage
                      src={session?.user?.image}
                      alt={
                        session?.user?.email?.substring(0, 2).toUpperCase() ||
                        "not logged in"
                      }
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <AvatarFallback>{session?.user?.email}</AvatarFallback>
                  </Avatar>
                )}
                <p>{session?.user?.email}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/api/auth/signout">Sign out</Link>
              </Button>
            </div>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/api/auth/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
