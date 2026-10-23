
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

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-5 text-sm font-bold tracking-[0.3em] text-lime-400">
            WORKOUT LIBRARY
          </p>

          <h1 className="text-4xl font-black leading-tight tracking-wide sm:text-5xl lg:text-6xl">
            TRAIN WITH INTENT.
            <br />
            <span className="text-lime-400">LOG EVERY SET.</span>
          </h1>

          <p className="mt-6 max-w-xl leading-7 text-gray-400">
            FitLog is a dark, no-nonsense gym companion: pick a lift,
            lock it into today&apos;s plan, and watch the week&apos;s work
            add up.
          </p>

          <Link
            href="#library"
            className="mt-8 inline-flex items-center gap-3 bg-lime-400 px-6 py-4 font-black tracking-wide text-black transition hover:bg-lime-300"
          >
            BROWSE WORKOUTS <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 sm:aspect-[16/10] md:aspect-[4/5] lg:aspect-[5/4]">
          <Image
            src="/banner.png"
            alt="FitLog workout banner"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

      </section>

      {/* Workout Library */}
      <section
        id="library"
        className="mx-auto max-w-7xl px-6 py-16"
      >
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-lime-400">
            FIND YOUR NEXT LIFT
          </p>

          <h2 className="text-3xl font-black tracking-wide sm:text-4xl">
            THE LIBRARY
          </h2>

          <p className="mt-3 text-gray-400">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center">
            <span className="loading loading-spinner loading-lg text-lime-400"></span>
            <p className="mt-4 text-gray-400">Loading workouts...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="border border-red-500/30 p-8 text-center">
            <p className="text-red-400">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-lime-400 px-5 py-3 font-bold text-black"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && workouts.length === 0 && (
          <p className="border border-white/10 p-8 text-center text-gray-400">
            No workouts found.
          </p>
        )}

        {/* Workout Cards */}
        {!loading && !error && workouts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout, index) => (
              <article
                key={workout.id ?? index}
                className="overflow-hidden border border-white/10 bg-zinc-950 transition hover:border-lime-400/60"
              >
                {/* Workout Image */}
                <div className="flex h-48 items-center justify-center bg-zinc-900">
                  {workout.image ? (
                    <Image
                      src={workout.image}
                      alt={workout.name ?? "Workout"}
                      width={400}
                      height={300}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl" aria-hidden="true">
                      🏋️
                    </span>
                  )}
                </div>

                {/* Workout Information */}
                <div className="p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-lime-400">
                    {workout.category ?? workout.muscleGroup ?? "WORKOUT"}
                  </p>

                  <h3 className="text-xl font-black">
                    {workout.name ?? "Untitled Workout"}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                    {workout.description ?? "Explore this workout and add it to your plan."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-300">
                    {workout.equipment && (
                      <span>{workout.equipment}</span>
                    )}

                    {workout.duration != null && (
                      <span>{workout.duration} min</span>
                    )}

                    {workout.calories != null && (
                      <span>{workout.calories} kcal</span>
                    )}
                  </div>

                  <p className="mt-4 text-sm text-gray-400">
                    Rating: {workout.rating ?? "N/A"}
                  </p>

                  <Link
                    href={`/workout/${workout.id}`}
                    className="mt-5 inline-flex w-full justify-center border border-lime-400 px-4 py-3 text-sm font-bold text-lime-400 transition hover:bg-lime-400 hover:text-black"
                  >
                    VIEW DETAILS →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

