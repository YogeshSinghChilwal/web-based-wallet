"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import WalletGenerator from "./WalletGenerator";

const Hero = () => {
  const [pathType, setPathType] = useState(0);

  return (
    <div className="px-4 mt-4">
      {pathType === 0 ? (
        <div>
          <h2 className="text-2xl">Select a Blockchain to get started.</h2>
          <div className="mt-4">
            <Button onClick={() => setPathType(501)} size={"lg"}>
              Solanna
            </Button>
          </div>
        </div>
      ) : (
        <WalletGenerator pathType={pathType} />
      )}
    </div>
  );
};

export default Hero;
