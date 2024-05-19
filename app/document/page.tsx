"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clipboard, KeyRound } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CryptoJS from "crypto-js";
import pbkdf2 from "pbkdf2";
import { useEffect, useMemo, useRef, useState } from "react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

function deriveKey(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

function encrypt(data: string, password: string): string {
  const key = deriveKey(password);
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  return JSON.stringify({ encrypted });
}

function decrypt(ciphertext: string, password: string): string | null {
  try {
    const { encrypted } = JSON.parse(ciphertext);
    const key = deriveKey(password);
    const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
      CryptoJS.enc.Utf8
    );
    return decrypted || null;
  } catch (error) {
    //console.error("Failed to decrypt data:", error);
    return null;
  }
}

const DOC_NAME = "encrypted-docs";
export default function Page() {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    const password = "password";
    const data = "Hello, World!";
    localStorage.setItem("test", encrypt(data, password));
    const password2 = "password";
    const loadedData = decrypt(localStorage.getItem(DOC_NAME)!, password2);
    //console.log("Loaded data:", loadedData);
  }, []);

  useEffect(() => {
    const encrypted = localStorage.getItem(DOC_NAME);
    console.log(encrypted, password);
    if (encrypted === null) {
      setOpen(true);
      setFirstTime(true);
      return;
    }
    const decrypted = decrypt(encrypted, password);
    console.log(password, decrypted);
    if (decrypted === null) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [password]);

  return (
    <div className="p-4">
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            router.back();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {firstTime
                ? `Please enter password for encryption`
                : `The documents are encrypted`}
            </DialogTitle>
            <DialogDescription>
              {firstTime ? (
                <div>
                  <p>
                    This is the first time you are using this feature. Please
                    enter a password to encrypt your documents. You{" "}
                    <span className=" font-bold">must remember</span> this
                    password as it will be required to decrypt the documents
                    later!
                  </p>
                </div>
              ) : (
                `The documents are encrypted. Please enter same password to decrypt the documents.`
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5 ">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              name="password"
              autoComplete="new-password"
              required
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className="flex gap-2"
            onClick={() => {
              if (firstTime) {
                const data = "Hello, World!";
                console.log(
                  "encrypt with password",
                  password,
                  encodeURIComponent(password),
                  data,
                  password === "password"
                );
                const encrypted = encrypt(data, password);
                localStorage.setItem(DOC_NAME, encrypted);
                setOpen(false);
              }
            }}
          >
            <KeyRound className="min-w-4 size-4" />
            {firstTime ? "Encrypt" : "Decrypt"}
          </Button>
        </DialogContent>
      </Dialog>
      {/* <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Button
              variant="outline"
              className="flex gap-4 w-full justify-start text-wrap h-auto "
            >
              <Clipboard className="min-w-4 size-4" />
              YOUR-NAME
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>PIN</Label>

            <Button
              variant="outline"
              className="flex gap-4  w-full justify-start text-wrap h-auto "
            >
              <Clipboard className="min-w-4 size-4" />
              1234-5678-9012-3456
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
