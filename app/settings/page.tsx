"use client";

import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useContext, useMemo, useState } from "react";

import { ThemeToggle } from "@/components/atoms/themeToggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ProfileMenu } from "@/components/dialogs/profileDL";
import { Button } from "@/components/ui/button";
import { AccountContext } from "@/components/context/account";

export default function Page() {
  const account = useContext(AccountContext);
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col p-4 gap-4 max-w-sm w-full ">
        <h1 className="text-xl font-bold">Settings</h1>
        <div className="flex items-center gap-4">
          <Label className="min-w-20 text-right">Theme</Label>
          <ThemeToggle />
        </div>
        <ProfileMenu />
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
      </div>
    </div>
  );
}
