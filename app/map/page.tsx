"use client";
import React, { Suspense, useContext } from "react";

// Import the map component

import { AccountContext } from "@/components/context/account";
import { Spots } from "@/components/organisms/spots";

function App() {
  const context = useContext(AccountContext);

  return (
    <div className="flex h-full min-h-0 grow flex-col">
      <Suspense>
        <Spots />
      </Suspense>
    </div>
  );
}

export default App;
