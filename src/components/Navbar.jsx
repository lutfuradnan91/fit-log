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

  useEffect(() => {setMounted(true);
    
  }, []);

  const isWorkoutPage = pathname === "/";
  const isPlanPage = pathname === "/my-plan";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black">
      <div className="navbar mx-auto min-h-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="FitLog logo"
              width={42}
              height={42}
              priority
              className="h-10 w-10 object-contain"
            />

            <span className="text-xl font-black tracking-wider text-white">
              FIT<span className="text-lime-400">LOG</span>
            </span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal items-center gap-2 px-1">
            <li>
              <Link
                href="/" className={`font-bold uppercase tracking-wider ${isWorkoutPage ? "bg-lime-400 text-black hover:bg-lime-300"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >Workout</Link>
            </li>

            <li>
              <Link
                href="/my-plan" className={`font-bold uppercase tracking-wider ${isPlanPage ? "bg-lime-400 text-black hover:bg-lime-300"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >My Plan
              </Link>
            </li>
          </ul>
        </nav>

        {/* Plan and Saved counters */}

        <div className="navbar-end gap-2">
          <Link href="/my-plan"
            className="flex items-center gap-2 rounded-full bg-lime-400 px-3 py-2 text-xs font-black text-black transition hover:bg-lime-300 sm:px-4 sm:text-sm"
          >
            Plan

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs text-lime-400">
             {mounted && hydrated ? plan.length : 0}
            </span>
          </Link>

          <Link
            href="/my-plan?tab=saved"
            className="flex items-center gap-2 rounded-full border border-white/30 px-3 py-2 text-xs font-bold text-white transition hover:border-lime-400 sm:px-4 sm:text-sm"
          >
            Saved

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/10 px-1 text-xs">
             {mounted && hydrated ? saved.length : 0}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile navigation */}

      <div className="flex justify-center gap-3 border-t border-white/10 px-4 py-2 md:hidden">
        <Link href="/" className={`rounded-md px-4 py-2 text-sm font-bold ${isWorkoutPage
          ? "bg-lime-400 text-black" : "text-gray-300 hover:bg-white/10"
          }`} >Workout</Link>

        <Link href="/my-plan" className={`rounded-md px-4 py-2 text-sm font-bold ${isPlanPage ? "bg-lime-400 text-black" : "text-gray-300 hover:bg-white/10"
          }`}>My Plan</Link>
      </div>
    </header>
  );
};

export default Navbar;