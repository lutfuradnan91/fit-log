"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useFitLog } from "@/context/FitLogContext";

function MyPlanContent() {
const {plan,saved,completed,hydrated,removeFromPlan,removeSaved,markAsDone,
} = useFitLog();

const searchParams = useSearchParams();

const [activeTab, setActiveTab] = useState("plan");
const [search, setSearch] = useState("");
const [sortBy, setSortBy] = useState("duration");

useEffect(() => {
setActiveTab(searchParams.get("tab") === "saved" ? "saved" : "plan");
}, [searchParams]);

const workouts = activeTab === "plan" ? plan : saved;

const filteredWorkouts = useMemo(() => {
const query = search.trim().toLowerCase();


const filtered = workouts.filter((workout) => {
  const name = String(workout.name ?? "").toLowerCase();
  const equipment = String(workout.equipment ?? "").toLowerCase();
  const category = String(
    workout.category ?? workout.muscleGroup ?? ""
  ).toLowerCase();

  return (
    name.includes(query) ||
    equipment.includes(query) ||
    category.includes(query)
  );
});

return [...filtered].sort((a, b) => {
  if (sortBy === "calories") {
    return Number(b.calories ?? 0) - Number(a.calories ?? 0);
  }

  if (sortBy === "rating") {
    return Number(b.rating ?? 0) - Number(a.rating ?? 0);
  }

  return Number(a.duration ?? 0) - Number(b.duration ?? 0);
});


}, [workouts, search, sortBy]);

const totalMinutes = plan.reduce(
(total, workout) => total + Number(workout.duration ?? 0),
0
);

const totalCalories = plan.reduce(
(total, workout) => total + Number(workout.calories ?? 0),
0
);

if (!hydrated) {
return ( <main className="flex min-h-[70vh] items-center justify-center bg-black text-white"> <div className="text-center"> <span className="loading loading-spinner loading-lg text-lime-400" /> <p className="mt-4 text-sm text-gray-400">Loading your plan...</p> </div> </main>
);
}

return ( <main className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 lg:px-8"> <div className="mx-auto max-w-7xl">
{/* heading page */}
<div className="mb-10"> <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-lime-400">
Your Fitness Journey </p>


      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
        MY <span className="text-lime-400">PLAN</span>
      </h1>

      <p className="mt-4 max-w-2xl text-gray-400">
        Cap of five lifts for today. Finish them, then load more.
      </p>
    </div>

    {/* Summary Cards */}
    <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Exercises
        </p>
        <p className="mt-3 text-4xl font-black text-lime-400">{plan.length}
          <span className="ml-2 text-lg font-medium text-gray-500">/ 5
          </span>
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Total Minutes</p>
        <p className="mt-3 text-4xl font-black">{totalMinutes}
          <span className="ml-2 text-lg font-medium text-gray-500">
            min
          </span>
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Total Calories
        </p>
        <p className="mt-3 text-4xl font-black">
          {totalCalories}
          <span className="ml-2 text-lg font-medium text-gray-500">kcal</span>
        </p>
      </div>
    </section>

    {/* Tabs */}

    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab("plan");
            setSearch("");
          }}
          className={`border-b-2 px-1 pb-4 text-sm font-black uppercase tracking-wider transition ${
            activeTab === "plan" ? "border-lime-400 text-lime-400"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Today&apos;s Plan ({plan.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("saved");
            setSearch("");
          }}
          className={`border-b-2 px-1 pb-4 text-sm font-black uppercase tracking-wider transition ${
            activeTab === "saved"? "border-lime-400 text-lime-400"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Saved ({saved.length})
        </button>
      </div>
    </div>

    {/* Search and Sorting */}

    {workouts.length > 0 && (
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search workouts..."
          aria-label="Search workouts"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-lime-400 sm:flex-1"
        />

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Sort workouts"
          className="rounded-xl border border-white/15 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-lime-400"
        >
          <option value="duration">Sort by Duration</option>
          <option value="calories">Sort by Calories</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>
    )}

    {/* Workout Cards */}

    {filteredWorkouts.length > 0 ? (
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredWorkouts.map((workout) => {
          const isCompleted = completed.some(
            (id) => String(id) === String(workout.id)
          );

          const category =
            workout.category ?? workout.muscleGroup ?? "Workout";

          return (
            <article
              key={workout.id}
              className={`overflow-hidden rounded-2xl border bg-white/[0.04] transition hover:border-lime-400/50 ${
                isCompleted
                  ? "border-lime-400/50"
                  : "border-white/10"
              }`}
            >
              {/* Workout Image */}
              <div className="relative h-52 bg-neutral-900">
                {workout.image ? (
                  <Image
                    src={workout.image}
                    alt={workout.name ?? "Workout"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}

                <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-bold uppercase text-lime-400">
                  {category}
                </span>

                {isCompleted && activeTab === "plan" && (
                  <span className="absolute right-4 top-4 rounded-full bg-lime-400 px-3 py-1 text-xs font-black text-black">
                    COMPLETED
                  </span>
                )}
              </div>

              {/* Workout Information */}

              <div className="p-5">
                <h2 className="text-xl font-black">
                  {workout.name ?? "Untitled Workout"}
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Equipment: {workout.equipment ?? "Not specified"}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 border-y border-white/10 py-4">
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="mt-1 font-bold">
                      {workout.duration ?? 0} min
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Calories</p>
                    <p className="mt-1 font-bold">
                      {workout.calories ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="mt-1 font-bold">{workout.rating ?? "N/A"}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/workout/${workout.id}`}
                    className="flex-1 rounded-lg border border-white/20 px-3 py-3 text-center text-sm font-bold transition hover:border-lime-400 hover:text-lime-400"
                  >
                    View Details
                  </Link>

                  {activeTab === "plan" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => markAsDone(workout.id)}
                        disabled={isCompleted}
                        className="flex-1 rounded-lg bg-lime-400 px-3 py-3 text-sm font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-gray-400"
                      >
                        {isCompleted ? "Done ✓" : "Mark as Done"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromPlan(workout.id)}
                        aria-label={`Remove ${workout.name} from plan`}
                        title="Remove from plan"
                        className="rounded-lg border border-red-500/40 px-4 py-3 font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeSaved(workout.id)}
                      aria-label={`Remove ${workout.name} from saved workouts`}
                      title="Remove saved workout"
                      className="rounded-lg border border-red-500/40 px-4 py-3 font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    ) : (
      /* Empty State */
      
      <section className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-5 py-12 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/10 text-3xl text-lime-400">
          {search ? "⌕" : "＋"}
        </div>

        <h2 className="text-2xl font-black tracking-wider">
          {search ? "NO MATCHES FOUND" : "NOTHING HERE YET"}
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
          {search
            ? "Try a different workout name, equipment, or category."
            : activeTab === "plan"
              ? "Browse the library and add a lift to get today moving."
              : "Save a workout for later and it will appear here."}
        </p>

        {!search && (
          <Link
            href="/"
            className="mt-6 rounded-lg bg-lime-400 px-6 py-3 text-sm font-black uppercase tracking-wider text-black transition hover:bg-lime-300"
          >
            Go to workouts
          </Link>
        )}
      </section>
    )}
  </div>
</main>


);
}

export default function MyPlanPage() {
return (
<Suspense
fallback={ <main className="flex min-h-[70vh] items-center justify-center bg-black text-white"> <span className="loading loading-spinner loading-lg text-lime-400" /> </main>
}
> <MyPlanContent /> </Suspense>
);
}
