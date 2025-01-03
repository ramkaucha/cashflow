"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Rubik_Vinyl } from "next/font/google";
import { Gluten } from "next/font/google";
import { ThemeToggle } from "./theme/theme-toggle";
import FlashingLogo from "./flashing-logo";

interface SitePage {
  name: string;
  route: string;
  current: boolean;
}

const sitePages: SitePage[] = [
  {
    name: "Dashboard",
    route: "/dashboard",
    current: false,
  },
  {
    name: "Summary",
    route: "/summary",
    current: false,
  },
];

export default function Navigation() {
  const currentPath = usePathname();
  const router = useRouter();

  const [pages, setPages] = useState(() =>
    sitePages.map((page) => ({
      ...page,
      current: page.route === currentPath,
    }))
  );

  const handleClick = (page: SitePage) => {
    setPages(
      pages.map((p) => ({
        ...p,
        current: p.name === page.name,
      }))
    );

    router.push(page.route);
  };

  return (
    <motion.nav>
      <div className="flex justify-between items-center w-full px-5 pt-1">
        <div className="py-2 sm:block flex-col hidden">
          <FlashingLogo />
        </div>
        <div className="flex md:space-x-3">
          {pages.map((page) => (
            <motion.button
              key={page.name}
              onClick={() => handleClick(page)}
              aria-current={page.current ? "page" : undefined}
              className={`
              text-sm p-2 rounded-md my-3 leading-none h-fit font-semibold
              ${page.current ? "text-white" : "text-gray-800"}`}
              animate={{
                backgroundColor: page.current ? "#6b1c8c" : "#F3F4F6",
              }}
              transition={{ duration: 0.2 }}
            >
              {page.name}
            </motion.button>
          ))}
          <div className="py-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
