import React from "react";
import Link from "next/link";

import { Button } from "@repo/ui/components/button";

const page = () => {
  return (
    <div className="flex flex-col gap-10 items-center justify-center min-h-screen">
      <h1 className="text-7xl font-semibold">Hello, World!</h1>

      <Link href="/sign-in">
        <Button size={"lg"}>Register</Button>
      </Link>
    </div>
  );
};

export default page;
