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
import { useEffect, useMemo, useState } from "react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

const keyCache: { [password: string]: string } = {};

function deriveKey(password: string): string {
  if (keyCache[password]) {
    return keyCache[password];
  }
  const salt = bcrypt.genSaltSync(10); // Adjust salt rounds as needed
  const key = bcrypt.hashSync(password, salt);
  keyCache[password] = key;
  return key;
}

function encrypt(data: string, password: string): string {
  const key = deriveKey(password);
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  return JSON.stringify({ key, encrypted });
}

function decrypt(ciphertext: string, password: string): string | null {
  try {
    const { key, encrypted } = JSON.parse(ciphertext);
    if (key !== deriveKey(password)) {
      throw new Error("Incorrect password");
    }
    const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
      CryptoJS.enc.Utf8
    );
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return null;
  }
}

function saveToLocalStorage(key: string, data: string, password: string): void {
  const encryptedData = encrypt(data, password);
  localStorage.setItem(key, encryptedData);
}

function loadFromLocalStorage(key: string, password: string): string | null {
  const encryptedData = localStorage.getItem(key);
  if (!encryptedData) return null;
  return decrypt(encryptedData, password);
}

const DOC_NAME = "encrypted-docs";
export default function Page() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  // test to store sample data and veryfy it
  // useEffect(() => {
  //   const password = "password";
  //   const data = "Hello, World!";
  //   saveToLocalStorage(DOC_NAME, data, password);
  //   const password2 = "password2";
  //   const loadedData = loadFromLocalStorage(DOC_NAME, password2);
  //   console.log("Loaded data:", loadedData);
  // }, []);

  // if user haven't login prompt
  const open = useMemo(() => {
    return loadFromLocalStorage(DOC_NAME, password) === null;
  }, [password]);
  //is first time by checking if DOC_NAME is in local storage
  const firstTime = useMemo(() => {
    return localStorage.getItem(DOC_NAME) === null;
  }, []);

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
        <DialogTrigger>Open</DialogTrigger>
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
          <input type="password" autoComplete="new-password" />
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
            <input type="password" autoComplete="current-password" />

            <input type="email" autoComplete="email" />
          </div>
          <form>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                autoComplete="new-password" // This triggers strong password suggestions
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>
          <Button className="flex gap-2">
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
