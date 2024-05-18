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
    if (url.match(/\.(jpeg|jpg|gif|png)$/) !== null) return true;
    if (url.match(/lh3.googleusercontent.com/) !== null) return true;
    if (url.match(/maps.googleapis.com/) !== null) return true;

    return false;
  };

  const renderFile = (index: number, url: string, loc: Location) => {
    if (isImage(url)) {
      return (
        <Image
          src={url}
          width={512}
          height={0}
          className="h-[160px] w-full object-cover opacity-100 duration-300  data-[loaded=false]:opacity-0 sm:rounded-lg"
          alt="thumbnail"
          data-loaded="false"
          onLoad={(event) => {
            event.currentTarget.setAttribute("data-loaded", "true");
          }}
          onClick={() => {
            window.history.pushState(
              null,
              "",
              `?openImage=true&loc=${loc.name}&imgId=${index}`
            );
          }}
        />
      );
    } else if (url.match(/.pdf$/)) {
      return (
        <Link
          href={url}
          target="_blank"
          className="flex flex-col h-[160px] justify-center items-center sm:rounded-lg overflow-hidden"
        >
          <Document
            file={url}
            onLoadError={console.error}
            className="w-full h-full overflow-hidden"
          >
            <Page pageNumber={1} renderTextLayer={false} width={500} />
          </Document>
        </Link>
      );
    } else {
      return (
        <Link
          href={url}
          target="_blank"
          className="flex flex-col h-[160px] justify-center items-center sm:rounded-lg overflow-hidden"
        >
          <FileText className="size-16" strokeWidth={1.5} />
          <p className="truncate max-w-[300px] md:max-w-[180px]">
            {decodeURIComponent(loc.imgs[index])
              .split("/")
              .pop()
              ?.split("_")
              .pop()}
          </p>
        </Link>
      );
    }
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
            <div className="flex  w-screen justify-center  gap-2 self-center  sm:p-2 sm:pb-0">
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

                  <CarouselItem className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <Card className="">
                      <Input
                        type="file"
                        title="Upload File"
                        onChange={async (e) => {
                          if (e.target.files) {
                            toast({
                              title: "Uploading image...",
                              description: "It may take a few seconds.",
                            });
                            const formData = new FormData();
                            formData.append("file", e.target.files[0]);
                            formData.append(
                              "account",
                              account?.account.email || "_"
                            );
                            formData.append("profile", loc.name);
                            const res = await (
                              await fetch("/api/upload", {
                                method: "POST",
                                body: formData,
                              })
                            ).json();
                            if (res.status === "success") {
                              toast({
                                title: "Image uploaded",
                              });
                              loc.imgs.push(res.url);
                              setLoc(loc);
                            } else {
                              toast({
                                title: "Failed to upload image",
                              });
                            }
                          }
                        }}
                        className="h-[160px] text-transparent"
                      />
                    </Card>
                  </CarouselItem>
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
                <LocateFixed />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={`https://www.google.com/search?q=${loc.name}`}
                  target="_blank"
                >
                  <Search />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.name}&query_place_id=${loc.id}`}
                  target="_blank"
                >
                  <ExternalLink />
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
