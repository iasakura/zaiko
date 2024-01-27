"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const InnerTable = dynamic(() => import("./InnerTable"), { ssr: false });

export const Table = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <InnerTable />
    </Suspense>
  );
};
