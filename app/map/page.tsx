"use client";
import React, { useContext } from "react";

import MapUI from "./MapUI"; // Import the map component

import { AccountContext } from "@/components/context/account";
import { EditLocation } from "@/components/dialogs/editLocation";
import { Spots } from "@/components/organisms/spots";

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
