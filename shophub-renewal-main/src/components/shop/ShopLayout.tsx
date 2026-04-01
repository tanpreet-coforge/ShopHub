import React from "react";
import { Outlet } from "react-router-dom";
import { ShopHeader } from "./ShopHeader";
import { ShopFooter } from "./ShopFooter";

export const ShopLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ShopHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <ShopFooter />
    </div>
  );
};
