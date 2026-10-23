"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useFitLog } from "@/context/FitLogContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const { plan, saved, hydrated } = useFitLog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWorkoutPage = pathname === "/";
  const isPlanPage = pathname === "/my-plan";

  const planCount = mounted && hydrated ? plan.length : 0;
  const savedCount = mounted && hydrated ? saved.length : 0;



  const navLinkClass = () =>
    "rounded-full bg-[#9CA3AF] px-4 py-1.5 text-sm font-medium !text-white transition-colors duration-200 hover:!text-[#C2F800]";



  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]">
      <div className="mx-auto grid h-20 max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center px-6">

        <Link href="/" className="flex items-center gap-2 justify-self-start">
          <Image
            src="/logo.png"
            alt="FitLog logo"
            width={28}
            height={28}
            priority
            className="h-7 w-7 object-contain"
          />
          <span className="text-lg font-bold uppercase tracking-wider text-white">
            FitLog
          </span>
        </Link>

        {/* Links - center  */}

        <nav className="hidden md:block">
          <ul className="flex items-center gap-2">
            <li>
              <Link href="/" className={navLinkClass(isWorkoutPage)}>
                Workouts
              </Link>
            </li>
            <li>
              <Link href="/my-plan" className={navLinkClass(isPlanPage)}>
                My Plan
              </Link>
            </li>
          </ul>
        </nav>

        {/* Badges - right */}

        <div className="col-start-3 flex items-center gap-3 justify-self-end">
          {/* Plan badge: accent filled circle counter */}
          <Link href="/my-plan" className="flex items-center gap-2 text-sm text-white transition hover:text-[#ccff00]" >
            Plan
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ccff00] px-1 text-xs font-bold text-black">
              {planCount}
            </span>
          </Link>

          {/* Saved badge: outlined counter */}

          <Link href="/my-plan?tab=saved"
            className="flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
          >
            Saved
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-white/30 px-1 text-xs text-white">
              {savedCount} </span>
          </Link>
        </div>
      </div>

      {/* Mobile navigation */}

      <nav className="flex justify-center gap-3 border-t border-white/10 px-4 py-2 md:hidden">
        <Link href="/" className={navLinkClass(isWorkoutPage)}>Workouts</Link>
        <Link href="/my-plan" className={navLinkClass(isPlanPage)}>My Plan</Link>
      </nav>
    </header>
  );
};

export default Navbar;