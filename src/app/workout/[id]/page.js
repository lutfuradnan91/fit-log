"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFitLog } from "@/context/FitLogContext";

function WorkoutDetailsContent() {
  const params = useParams();
  const id = params.id;

  const { addToPlan, saveForLater } = useFitLog();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;


    const fetchWorkout = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`);

        if (!response.ok) {
          throw new Error("Workout not found.");
        }

        const result = await response.json();
        const data = result.data ?? result.workout ?? result;

        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("Invalid workout data.");
        }

        setWorkout(data);
      } catch (err) {
        console.error("Workout details error:", err);
        setError("Unable to load workout details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();}, [id]);

  if (loading) {
    return (<main className="flex min-h-[75vh] items-center justify-center bg-[#0c0d10] text-white"> <div className="text-center"> <span className="loading loading-spinner loading-lg text-[#ccff00]" /> <p className="mt-4 text-sm text-[#9299a7]">
      Loading workout details... </p> </div> </main>
    );
  }

  if (error || !workout) {
    return (<main className="flex min-h-[75vh] items-center justify-center bg-[#0c0d10] px-6 text-white"> <div className="max-w-md text-center"> <h1 className="text-3xl font-black">WORKOUT NOT FOUND</h1>


      <p className="mt-4 text-[#9299a7]">{error || "This workout could not be found."}</p>

      <Link href="/"className="mt-6 inline-flex rounded-md bg-[#ccff00] px-6 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
      >BACK TO WORKOUTS</Link>
    </div>
    </main>
    );


  }

  const name = workout.name ?? workout.title ?? "Workout";
  const description = workout.description ?? "No description available for this workout.";

  const muscleGroups = Array.isArray(workout.muscleGroups)? workout.muscleGroups: workout.category? [workout.category]: workout.muscleGroup
        ? [workout.muscleGroup]: ["Workout"];

  const equipment = workout.equipment ?? "Not specified";
  const difficulty = workout.difficulty ?? "Not specified";
  const duration = workout.duration ?? "N/A";
  const calories = workout.caloriesBurned ?? workout.calories ?? "N/A";
  const rating = workout.rating ?? "N/A";
  const sets = workout.sets ?? "N/A";
  const reps = workout.reps ?? "N/A";

  const instructions = Array.isArray(workout.instructions)? workout.instructions: Array.isArray(workout.steps)? workout.steps: [];

  const stats = [
    { label: "EQUIPMENT", value: equipment },
    { label: "DIFFICULTY", value: difficulty },
    { label: "SETS", value: sets },
    { label: "REPS", value: reps },
    {
      label: "DURATION",
      value: typeof duration === "number" ? `${duration} min` : duration,
    },
    {
      label: "CALORIES",
      value: typeof calories === "number" ? `${calories} kcal` : calories,
    },
    { label: "RATING", value: rating },
  ];

  return (<main className="min-h-[calc(100vh-140px)] bg-[#0c0d10] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-12"> <div className="mx-auto max-w-[1440px]"> <Link
    href="/" className="mb-6 inline-flex text-xs font-bold tracking-wide text-[#ccff00] transition hover:text-lime-300"
  >← BACK TO WORKOUTS </Link>


    <section className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_1fr] lg:gap-14">
      {/* Workout Image */}
      <div className="relative aspect-[4/5] max-h-[740px] w-full overflow-hidden rounded-xl bg-[#15171d]">
        {workout.image ? (
          <Image src={workout.image}
            alt={name}fill priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-7xl">
            🏋️
          </div>
        )}
      </div>

      {/* Workout Information */}

      <div className="min-w-0">
        <h1 className="text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl lg:text-[42px]">{name}</h1>

        <p className="mt-3 text-sm leading-6 text-[#a0a5b1] sm:text-base">{description}</p>

        {/* Muscle Group Badges */}

        <div className="mt-5 flex flex-wrap gap-2">
          {muscleGroups.map((group, index) => (
            <span
              key={`${group}-${index}`}
              className="rounded-full bg-[#ccff00] px-4 py-1.5 text-xs font-semibold text-black"
            >
              {group}
            </span>
          ))}
        </div>

        {/* Workout Statistics */}
        <div className="mt-7 overflow-hidden rounded-2xl border border-[#262a34] bg-[#15171d]">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={`flex min-h-[49px] items-center justify-between gap-4 px-5 py-3 sm:px-6 ${index !== stats.length - 1
                  ? "border-b border-[#262a34]"
                  : ""
                }`}
            >
              <span className="text-[11px] font-bold tracking-wider text-[#9299a7] sm:text-xs">
                {item.label}
              </span>

              <span className="break-words text-right text-sm text-[#e5e7eb]">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <section className="mt-8">
          <h2 className="text-base font-black uppercase tracking-wide">INSTRUCTIONS</h2>

          {instructions.length > 0 ? (
            <ol className="mt-4 space-y-3">
              {instructions.map((step, index) => {
                const instructionText =
                  typeof step === "string"
                    ? step
                    : step.instruction ??
                    step.description ??
                    JSON.stringify(step);

                return (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-6 text-[#c4c7cf]"
                  >
                    <span className="shrink-0 text-[#9299a7]">
                      {index + 1}.
                    </span>
                    <span>{instructionText}</span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-[#9299a7]">
              Instructions are not available for this workout.
            </p>
          )}
        </section>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => addToPlan(workout)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ccff00] px-5 text-sm font-semibold text-black transition hover:bg-lime-300"
          >
            <span aria-hidden="true">▦</span>
            Add to today&apos;s plan
          </button>

          <button onClick={() => saveForLater(workout)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#3a4050] px-5 text-sm font-medium text-white transition hover:border-[#ccff00]"
          >
            <span aria-hidden="true">♧</span>
            Save for later
          </button>
        </div>
      </div>
    </section>
  </div>
  </main>


  );
}

export default function WorkoutDetailsPage() {
  return (
    <Suspense fallback={<main className="flex min-h-[75vh] items-center justify-center bg-[#0c0d10] text-white"> <div className="text-center"> <span className="loading loading-spinner loading-lg text-[#ccff00]" /> <p className="mt-4 text-sm text-[#9299a7]">
        Loading workout details... </p> </div> </main>
      }
    > <WorkoutDetailsContent /> </Suspense>
  );
}
