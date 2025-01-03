import { useEffect, useState } from "react";
import { Modak } from "next/font/google";
import Link from "next/link";

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
});

export default function FlashingLogo() {
  const colours = [
    "text-red-500 dark:text-red-300",
    "text-yellow-500 dark:text-yellow-300",
    "text-green-500 dark:text-green-300",
    "text-blue-500 dark:text-blue-300",
    "text-indigo-500 dark:text-indigo-300",
    "text-purple-500 dark:text-purple-300",
    "text-pink-500 dark:text-pink-300",
  ];

  const [colourIndex, setColourIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColourIndex((prevIndex) => (prevIndex + 1) % colours.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [colours.length]);

  return (
    <Link
      href="/"
      className={`text-2xl transition-colors duration-300 ease-in-out ${modak.className} ${colours[colourIndex]}`}
    >
      CashFlow
    </Link>
  );
}
