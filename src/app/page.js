"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/fitlog"
        );


        if (!response.ok) {
          throw new Error("Failed to fetch workouts.");
        }

        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : result.data ?? result.workouts ?? [];

        if (!Array.isArray(data)) {
          throw new Error("Invalid workout data received.");
        }

        setWorkouts(data);
      } catch (err) {
        console.error("Workout API error:", err);
        setError("Unable to load workouts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();


  }, []);

  return (<main className="min-h-screen bg-[#0c0d10] text-white">
    {/* Hero */} <section className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-8 px-5 pb-12 pt-8 sm:px-8 md:grid-cols-[1.5fr_0.7fr] md:px-10 md:pb-14 md:pt-8"> <div className="rounded-xl border border-[#252832] bg-[#15171d] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"> <p className="mb-5 text-[11px] font-extrabold tracking-[0.12em] text-[#ccff00]">
      WORKOUT LIBRARY </p>


      <h1 className="max-w-3xl text-4xl font-black uppercase leading-[0.98] tracking-tight sm:text-5xl lg:text-[54px]">
        TRAIN WITH INTENT. LOG EVERY SET.
      </h1>

      <p className="mt-5 max-w-xl text-sm leading-6 text-[#9299a7]">
        FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
        into today&apos;s plan, and watch the week&apos;s work add up.
      </p>

      <Link href="#library"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[#ccff00] px-5 text-[11px] font-extrabold !text-black transition hover:bg-lime-300"
      >BROWSE WORKOUTS</Link>
    </div>

      <div className="relative mx-auto h-64 w-full max-w-sm md:h-[300px] lg:h-[340px]">
        <Image
          src="/banner.png"
          alt="Workout illustration"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 35vw"
          className="object-contain"
        />
      </div>
    </section>

    {/* Workout Library */}
    <section id="library"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-5 pb-16 sm:px-8 md:px-10 md:pb-20"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase leading-tight tracking-tight sm:text-[28px]">
          THE LIBRARY
        </h2>

        <p className="mt-1 text-xs text-[#9299a7] sm:text-sm">Twelve lifts covering every major muscle group.</p>
      </div>

      {loading && (
        <div className="py-16 text-center">
          <span className="loading loading-spinner loading-lg text-[#ccff00]" />
          <p className="mt-4 text-sm text-[#9299a7]">Loading workouts...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 p-8 text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-[#ccff00] px-5 py-3 text-sm font-bold text-black"
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {!loading && !error && workouts.length === 0 && (
        <p className="rounded-xl border border-white/10 p-8 text-center text-[#9299a7]">No workouts found.</p>
      )}

      {!loading && !error && workouts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {workouts.map((workout, index) => {
            const muscleGroups = Array.isArray(workout.muscleGroups) ? workout.muscleGroups : workout.category ? [workout.category] : workout.muscleGroup
              ? [workout.muscleGroup] : ["WORKOUT"];

            const calories = workout.caloriesBurned ?? workout.calories;

            return (
              <Link key={workout.id ?? index}
                href={`/workout/${workout.id}`}
                className="group block overflow-hidden rounded-xl border border-[#252832] bg-[#15171d] transition duration-200 hover:border-[#ccff00]/60"
              >
                {/* Card image */}

                <div className="relative h-44 overflow-hidden bg-[#1b1e25] sm:h-40 lg:h-[134px]">
                  {workout.image ? (
                    <Image src={workout.image}
                      alt={workout.name ?? "Workout"}
                      fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">🏋️</div>
                  )}
                </div>

                {/* Card information */}

                <div className="p-4">
                  <div className="mb-3 flex min-h-5 flex-wrap gap-1.5">
                    {muscleGroups.map((group, groupIndex) => (
                      <span key={`${group}-${groupIndex}`}
                        className="rounded-full bg-[#ccff00] px-2.5 py-1 text-[9px] font-extrabold uppercase leading-none text-black"
                      >
                        {group}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-sm font-black uppercase leading-5 tracking-wide">{workout.name ?? "Untitled Workout"}</h3>

                  <p className="mt-1 truncate text-[11px] text-[#9299a7]">{workout.equipment ?? "Bodyweight"}</p>

                  <div className="my-3 border-t border-[#252832]" />

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-[#9299a7]">
                    <span className="inline-flex items-center gap-1">
                      <span aria-hidden="true">◷</span>
                      {workout.duration ?? "—"} min
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <span aria-hidden="true">♟</span>
                      {calories ?? "—"} kcal
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <span aria-hidden="true">☆</span>
                      {workout.rating ?? "—"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  </main>


  );
}
