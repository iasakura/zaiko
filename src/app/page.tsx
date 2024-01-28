import React from "react";
import { Table } from "./components/Table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function Home() {
  const session = await auth();
  if (session == null) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <SessionProvider session={session}>
        <Table />
      </SessionProvider>
    </div>
  );
}
