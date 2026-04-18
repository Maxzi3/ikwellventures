"use client";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex justify-between items-center h-16">
        <Image
          src="/Ikwel-logo.png"
          alt="logo"
          width={100}
          height={100}
          className="block dark:hidden p-2"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
