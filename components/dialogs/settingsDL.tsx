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
        if (open) {
          setOpen(open);
        } else {
          setOpen(open);
        }
      }}
    >
      <DialogTrigger className="px-4" onClick={() => setOpen(true)}>
        <Settings
          strokeWidth={1.5}
          opacity={current === "profileManager" ? 1 : 0.5}
        />
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
                  <Image
                    src={session?.user?.image}
                    alt="user"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
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
