import Image from "next/image";
import React from "react";

export default function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        src="/images/addfiles.svg"
        alt="Add File"
        width={300}
        height={300}
      />
      <h2 className="text-2xl text-gray-1">No files found</h2>
    </div>
  );
}
