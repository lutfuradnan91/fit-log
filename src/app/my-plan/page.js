
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useFitLog } from "@/context/FitLogContext";

function MyPlanContent() {
  const {plan,saved,completed,hydrated,removeFromPlan,removeSaved,markAsDone,} = useFitLog();

  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("plan");
  const [sortBy, setSortBy] = useState("duration");

  useEffect(() => {
    setActiveTab(searchParams.get("tab") === "saved" ? "saved" : "plan");
  }, [searchParams]);

  const workouts = activeTab === "plan" ? plan : saved;

  const filteredWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => {
      if (sortBy === "calories") {
        return (
          Number(b.caloriesBurned ?? b.calories ?? 0) -
          Number(a.caloriesBurned ?? a.calories ?? 0)
        );
      }

      if (sortBy === "rating") {
        return Number(b.rating ?? 0) - Number(a.rating ?? 0);
      }

      return Number(a.duration ?? 0) - Number(b.duration ?? 0);
    });
  }, [workouts, sortBy]);

  const totalMinutes = plan.reduce((total, workout) => total + Number(workout.duration ?? 0),
    0
  );

  const totalCalories = plan.reduce((total, workout) =>
      total + Number(workout.caloriesBurned ?? workout.calories ?? 0),
    0
  );

  if (!hydrated) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-black text-white">
        <span className="loading loading-spinner loading-lg text-lime-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Summary */}

        <section className="mb-10 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-[#292c32] px-4 py-5 sm:gap-6 sm:px-8 sm:py-6">
          <div>
            <p className="text-xs font-semibold text-gray-300 sm:text-sm">Exercises</p>
            <p className="mt-2 text-3xl font-black text-lime-400 sm:text-4xl">{plan.length}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-300 sm:text-sm">Minutes</p>
            <p className="mt-2 text-3xl font-black sm:text-4xl">{totalMinutes}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-300 sm:text-sm">Calories</p>
            <p className="mt-2 text-3xl font-black sm:text-4xl">
              {totalCalories}
            </p>
          </div>
        </section>

        {/* Tabs and Sort */}

        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="inline-flex w-fit items-center rounded-xl border border-white/10 bg-[#202329] p-1">
            <button type="button"
              onClick={() => setActiveTab("plan")}
              className={`rounded-lg px-4 py-3 text-sm font-bold transition ${activeTab === "plan"
                ? "bg-[#15171b] text-lime-400"
                : "text-gray-400 hover:text-white"
                }`}
            >
              Today&apos;s Plan
            </button>

            <button type="button"
              onClick={() => setActiveTab("saved")}
              className={`rounded-lg px-4 py-3 text-sm font-bold transition ${activeTab === "saved"
                ? "bg-[#15171b] text-lime-400"
                : "text-gray-400 hover:text-white"
                }`}
            >
              Saved
            </button>
          </div>

          <div className="flex items-center gap-4 sm:ml-auto">
            <label htmlFor="sort-workouts"
              className="shrink-0 text-sm font-semibold text-gray-300"
            >Sort By</label>

            <select
              id="sort-workouts"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#111216] px-4 py-3 text-sm text-white outline-none focus:border-lime-400 sm:w-64 sm:flex-none"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </section>

        {/* Workout List */}

        {filteredWorkouts.length > 0 ? (
          <section className="space-y-5">
            {filteredWorkouts.map((workout) => {
              const isCompleted = completed.some(
                (id) => String(id) === String(workout.id)
              );

              const category =
                workout.category ?? workout.muscleGroup ?? "Workout";

              return (
                <article
                  key={workout.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#292c32] p-4 transition hover:border-white/20 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
                >
                  {/* Workout Image */}

                  <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-neutral-900 sm:h-28 sm:w-40">
                    {workout.image ? (
                      <Image
                        src={workout.image}
                        alt={workout.name ?? "Workout"}
                        fill
                        sizes="(max-width: 640px) 100vw, 160px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Workout Details */}

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-black uppercase leading-tight sm:text-xl">
                      {workout.name ?? "Untitled Workout"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">{category}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <span className="flex items-center gap-1.5 text-white">
                        <span className="text-lime-400">◷</span>
                        {workout.duration ?? 0} min
                      </span>

                      <span className="flex items-center gap-1.5 text-white">
                        <span className="text-lime-400">♨</span>
                        {workout.caloriesBurned ?? workout.calories ?? 0} kcal
                      </span>

                      <span className="flex items-center gap-1.5 text-white">
                        <span className="text-lime-400">★</span>
                        {workout.rating ?? "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}

                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    <Link href={`/workout/${workout.id}`}
                      className="rounded-full border border-gray-400 px-4 py-2.5 text-center text-xs font-bold transition hover:border-lime-400 hover:text-lime-400 sm:text-sm"
                    >View Details</Link>

                    {activeTab === "plan" && (
                      <button type="button"
                        onClick={() => markAsDone(workout.id)}
                        disabled={isCompleted}
                        className="rounded-full bg-lime-400 px-4 py-2.5 text-xs font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:text-gray-300 sm:text-sm"
                      >
                        {isCompleted ? "✓ Done" : "✓ Mark as Done"}
                      </button>
                    )}

                    <button type="button" onClick={() =>
                        activeTab === "plan"? removeFromPlan(workout.id)
                          : removeSaved(workout.id)
                      }
                      aria-label={`Remove ${workout.name ?? "workout"}`}
                      title="Remove workout"
                      className="rounded-full px-2.5 py-2 text-xl font-bold text-gray-300 transition hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#202329] px-5 py-12 text-center">
            <h2 className="text-xl font-black text-white">
              {activeTab === "plan"? "NOTHING HERE YET" : "NO SAVED WORKOUTS"}
            </h2>

            <p className="mt-3 text-sm text-gray-400">
              {activeTab === "plan" ? "Browse the library and add a lift to get today moving.."
                : "Save a workout to see it here."}
            </p>

            <Link href="/"
              className="mt-6 rounded-lg bg-lime-400 px-6 py-3 text-sm font-black  tracking-wider !text-black transition hover:bg-lime-300"
            >Go to workouts</Link>
          </section>
        )}
      </div>
    </main>
  );
}

export default function MyPlanPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center bg-black text-white">
          <span className="loading loading-spinner loading-lg text-lime-400" />
        </main>
      }
    >
      <MyPlanContent />
    </Suspense>
  );
}

