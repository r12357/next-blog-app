"use client";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

const Page: React.FC = () => {
  return (
    <main>
      <div className="mb-5 text-2xl font-bold">About</div>

      <div
        className={twMerge(
          "mx-auto mb-5 w-full md:w-2/3",
          "flex justify-center"
        )}
      >
        <Image
          src="/images/avatar.png"
          alt="Example Image"
          width={350}
          height={350}
          priority
          className="rounded-full border-4 border-slate-500 p-1.5"
        />
      </div>
      <div className="space-y-3">
        <div className="md:flex md:justify-center">
          <div className="font-bold md:w-1/6 md:text-center">名前</div>
          <div className="md:w-5/6">あああ</div>
        </div>
        <div className="md:flex md:justify-center">
          <div className="font-bold md:w-1/6 md:text-center">
            ぽーとふぉりお
          </div>
          <div className="mr-1 text-blue-500 underline md:w-5/6">
            <a href="#">ぽーとふぉりお</a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
