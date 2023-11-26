import Header from "@/components/header/Header";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Header />
      <h1 className="text-6xl font-bold relative">
        <span className="custom-shadow">4🫨4</span>
      </h1>
      <h2 className="text-xl font-normal my-4">
        This page could not be found.
      </h2>
    </div>
  );
};
