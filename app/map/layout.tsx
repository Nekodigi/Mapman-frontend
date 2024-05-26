"use client";

import { Suspense } from "react";
import MapUI from "./MapUI";
import { EditLocation } from "@/components/dialogs/editLocation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Spinner } from "@/components/ui/spinner";
import { pdfjs } from "react-pdf";
import useWindowDimensions from "@/components/atoms/windowDimension";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { height, width } = useWindowDimensions();
  const BP = 1000;

  const render = (status: Status): JSX.Element | null => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="flex h-full items-center justify-center">
            <Spinner size="large" show>
              <p>Loading map...</p>
            </Spinner>
          </div>
        );
      case Status.FAILURE:
        return <h1>Error loading maps</h1>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-0 grow flex-col">
      <ResizablePanelGroup direction={width > BP ? "horizontal" : "vertical"}>
        {width > BP && (
          <ResizablePanel className="flex flex-col">
            <Suspense>{children}</Suspense>
          </ResizablePanel>
        )}
        {width > BP && <ResizableHandle />}
        <ResizablePanel>
          <Wrapper
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!}
            render={render as any}
          >
            <MapUI />
          </Wrapper>
        </ResizablePanel>
        {width <= BP && <ResizableHandle />}
        {width <= BP && (
          <ResizablePanel className="flex flex-col">
            <Suspense>{children}</Suspense>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
      <Suspense>
        <EditLocation />
      </Suspense>
    </div>
  );
}
