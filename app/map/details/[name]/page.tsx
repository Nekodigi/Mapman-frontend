"use client";

import { AccountContext } from "@/components/context/account";
import { LocCtrlDD } from "@/components/dropdown/locCtrlDD";
import { LocationInfos } from "@/components/organisms/locationInfo";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Compass,
  ExternalLink,
  FileText,
  LocateFixed,
  Milestone,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense, useCallback, useContext, useMemo } from "react";
import { Card } from "@/components/ui/card";

import { CommentsProvider } from "@udecode/plate-comments";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { commentsUsers, myUserId } from "@/lib/plate/comments";
import { useToast } from "@/components/ui/use-toast";
import { Document, Page } from "react-pdf";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Location } from "@/type/location";
import { Plate } from "@udecode/plate-common";
import { plugins } from "@/lib/plate/plate-plugins";
import { Editor } from "@/components/plate-ui/editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePreview } from "@/components/molecules/filePreview";

export default function App({ params }: { params: { name: string } }) {
  const account = useContext(AccountContext);
  const router = useRouter();
  const { toast } = useToast();

  const loc = useMemo(() => {
    const name = decodeURIComponent(params.name);
    let l = account?.locs.find((l) => l.name === name);
    l?.imgs.forEach((img, i) => {
      l.imgs[i] = img.replace("maxwidth=128", "maxwidth=512");
    });
    return l;
  }, [account?.locs, params.name]);
  const setLoc = useCallback(
    (loc: Location) => {
      account?.locsDispatch({
        type: "edit",
        index: account.locs.findIndex((l) => l.name === loc.name),
        location: loc,
      });
    },
    [account]
  );

  const isImage = (url: string) => {
    if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) !== null) return true;
    if (url.match(/lh3.googleusercontent.com/) !== null) return true;
    if (url.match(/maps.googleapis.com/) !== null) return true;

    return false;
  };

  return (
    <ScrollArea className="h-full min-h-0">
      {loc && (
        <div className="flex min-h-0 grow flex-col overflow-auto">
          <div
            className="absolute z-10 p-4 h-[168px]"
            onClick={() => {
              router.push("/map");
            }}
          >
            <Button variant="outline" size="icon" className="">
              <ArrowLeft />
            </Button>
          </div>
          <Suspense>
            <div className="flex  w-screen justify-centergap-2 self-center  sm:p-2 sm:pb-0 min-h-[120px]">
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full "
              >
                <CarouselContent>
                  {loc.imgs.map((img, index) => (
                    <CarouselItem
                      key={index}
                      className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                    >
                      <Card className="h-[160px]">
                        <FilePreview url={img} />
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </Suspense>
          <div className="p-4">
            <LocationInfos loc={loc} />
            <div className="flex h-16 items-center justify-between">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={`/compass/${encodeURIComponent(loc.name)}`}
                  passHref
                >
                  <Compass />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={`/map/route?start=Current Position&end=${loc.name}`}
                  passHref
                >
                  <Milestone opacity={0.5} strokeWidth={1} />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  account?.setSearchOption((prev) => ({
                    ...prev,
                    center: loc,
                  }));
                }}
              >
                <LocateFixed opacity={0.5} strokeWidth={1} />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={`https://www.google.com/search?q=${loc.name}`}
                  target="_blank"
                >
                  <Search opacity={0.5} strokeWidth={1} />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.name}&query_place_id=${loc.id}`}
                  target="_blank"
                >
                  <ExternalLink opacity={0.5} strokeWidth={1} />
                </Link>
              </Button>
              <LocCtrlDD locName={loc.name} />
            </div>
            {loc.note && (
              <DndProvider backend={HTML5Backend}>
                <CommentsProvider users={commentsUsers} myUserId={myUserId}>
                  <Plate plugins={plugins} initialValue={JSON.parse(loc.note)}>
                    <Editor placeholder="Take a note..." />
                  </Plate>
                </CommentsProvider>
              </DndProvider>
            )}
          </div>
        </div>
      )}
    </ScrollArea>
  );
}
