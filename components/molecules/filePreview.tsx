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
import { Document, Page, pdfjs } from "react-pdf";

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
import { Spinner } from "../ui/spinner";

type FilePreviewProps = {
  url: string;
  passive?: boolean;
};

type LinkOrDivProps = {
  passive: boolean;
  url: string;
  children: React.ReactNode;
};
const LinkOrDiv = ({ passive, url, children }: LinkOrDivProps) => {
  if (passive) {
    return (
      <div className="flex flex-col h-full justify-center items-center sm:rounded-lg overflow-hidden">
        {children}
      </div>
    );
  } else {
    return (
      <Link
        href={url}
        target="_blank"
        className="flex flex-col h-full justify-center items-center sm:rounded-lg overflow-hidden"
      >
        {children}
      </Link>
    );
  }
};

export const FilePreview = ({ url, passive }: FilePreviewProps) => {
  const router = useRouter();
  const isImage = (url: string) => {
    if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) !== null) return true;
    if (url.match(/lh3.googleusercontent.com/) !== null) return true;
    if (url.match(/maps.googleapis.com/) !== null) return true;

    return false;
  };

  const renderFile = (url: string) => {
    if (isImage(url)) {
      return (
        <Image
          src={url}
          width={512}
          height={0}
          className="h-full w-full object-cover opacity-100 duration-300  data-[loaded=false]:opacity-0 rounded-lg"
          alt="thumbnail"
          data-loaded="false"
          onLoad={(event) => {
            event.currentTarget.setAttribute("data-loaded", "true");
          }}
          onClick={() => {
            if (passive) return;
            window.history.pushState(
              null,
              "",
              `?openImage=true&url=${encodeURIComponent(url)}`
            );
          }}
        />
      );
    } else {
      return (
        <LinkOrDiv passive={passive ? true : false} url={url}>
          {url.match(/.pdf$/) ? (
            <Document
              file={url}
              onLoadError={console.error}
              className="w-full h-full overflow-hidden "
              loading={
                <div className="flex justify-center items-center min-h-full h-full w-full">
                  <Spinner />
                </div>
              }
            >
              <Page pageNumber={1} renderTextLayer={false} width={500} />
            </Document>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <FileText className="size-12" strokeWidth={1.5} />
              <p className="truncate max-w-[300px] md:max-w-[180px]">
                {decodeURIComponent(url).split("/").pop()?.split("_").pop()}
              </p>
            </div>
          )}
        </LinkOrDiv>
      );
      // return (
      //   <Link
      //     href={url}
      //     target="_blank"
      //     className="flex flex-col h-full justify-center items-center sm:rounded-lg overflow-hidden"
      //   >
      //     <FileText className="size-16" strokeWidth={1.5} />
      //     <p className="truncate max-w-[300px] md:max-w-[180px]">
      //       {decodeURIComponent(url).split("/").pop()?.split("_").pop()}
      //     </p>
      //   </Link>
      // );
    }
  };

  return renderFile(url);
};
