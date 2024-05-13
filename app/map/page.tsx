"use client";
import React, { Suspense, useContext } from "react";

import MapUI from "./MapUI"; // Import the map component

import { AccountContext } from "@/components/context/account";
import { EditLocation } from "@/components/dialogs/editLocation";
import { Spots } from "@/components/organisms/spots";
import { Search } from "@/components/molecules/search";

function App() {
  const context = useContext(AccountContext);

  return (
    <div className="flex min-h-0 grow flex-col">
      <Suspense>
        <Spots />
      </Suspense>
    </div>
  );
}

export default App;
