"use client";

import Header from "@/components/Header";
import ABCRenderer from "./ABCRenderer";
import { useParams } from "next/navigation";

export default function SongPage() {
  const { id } = useParams<{ id: string }>(); // Use the type-safe `useParams`

  return (
    <div>
      <Header />
      <div className="md:max-w-screen-md bg-white m-auto sm:p-4 md:p-8 pb-20 min-h-[70vh]">
        <ABCRenderer handle={id} />
      </div>
    </div>
  );
}
