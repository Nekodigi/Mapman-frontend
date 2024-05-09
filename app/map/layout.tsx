import { Suspense } from "react";
import MapUI from "./MapUI";
import { EditLocation } from "@/components/dialogs/editLocation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-0 grow flex-col">
      <MapUI />
      <Suspense>
        <EditLocation />
      </Suspense>
      {children}
    </div>
  );
}
