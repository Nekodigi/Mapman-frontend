import { Suspense } from "react";
import MapUI from "./MapUI";
import { EditLocation } from "@/components/dialogs/editLocation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Search } from "@/components/molecules/search";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-0 grow flex-col">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <MapUI />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{children}</ResizablePanel>
      </ResizablePanelGroup>
      <Suspense>
        <EditLocation />
      </Suspense>
    </div>
  );
}
