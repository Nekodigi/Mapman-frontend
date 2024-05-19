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
import { Clipboard } from "lucide-react";

export default function Page() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
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
      </Card>
    </div>
  );
}
