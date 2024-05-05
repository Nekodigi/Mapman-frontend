"use client";
import React, { useContext } from "react";
import MapUI from "./MapUI"; // Import the map component
import { AccountContext } from "@/components/context/account";
import { Spots } from "@/components/organisms/spots";
import { EditLocation } from "@/components/dialogs/editLocation";

function App() {
  const context = useContext(AccountContext);

  return (
    <div className="flex flex-col flex-grow min-h-0">
      <MapUI />
      <Spots />
      <EditLocation />
    </div>
  );
}

export default App;
