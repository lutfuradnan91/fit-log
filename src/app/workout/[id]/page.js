"use client";

import Image from "next/image";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";

function WorkoutDetailsContent() {
    const params = useParams();
    const id = params.id;

    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;


        const fetchWorkout = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `https://api.abcz.workers.dev/api/fitlog/${id}`
                );

                if (!response.ok) {
                    throw new Error("Workout not found.");
                }

                const result = await response.json();

                const data = result.data ?? result.workout ?? result;

                if (
                    !data ||
                    typeof data !== "object" ||
                    Array.isArray(data)
                ) {
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

        fetchWorkout();


    }, [id]);

    if (loading) {
        return (<main className="flex min-h-screen items-center justify-center bg-black text-white"> <div className="text-center"> <span className="loading loading-spinner loading-lg text-lime-400"></span> <p className="mt-4 text-gray-400">
            Loading workout details... </p> </div> </main>
        );
    }

    if (error || !workout) {
        return (<main className="flex min-h-screen items-center justify-center bg-black px-6 text-white"> <div className="max-w-md text-center"> <h1 className="text-3xl font-black">
            WORKOUT NOT FOUND </h1>


            <p className="mt-4 text-gray-400">
                {error || "This workout could not be found."}
            </p>

            <Link
                href="/"
                className="mt-6 inline-flex bg-lime-400 px-6 py-3 font-bold text-black"
            >
                BACK TO WORKOUTS
            </Link>
        </div>
        </main>
        );


    }

    const name = workout.name ?? workout.title ?? "Workout";

    const description =
        workout.description ??
        "No description available for this workout.";

    const category = workout.category ?? workout.muscleGroup ??
        "Workout";

    const equipment = workout.equipment ?? "Not specified";
    const difficulty = workout.difficulty ?? "Not specified";
    const duration = workout.duration ?? "N/A";
    const calories = workout.calories ?? "N/A";
    const rating = workout.rating ?? "N/A";
    const sets = workout.sets ?? "N/A";
    const reps = workout.reps ?? "N/A";

    const instructions = Array.isArray(workout.instructions)
        ? workout.instructions
        : Array.isArray(workout.steps)
            ? workout.steps
            : [];

    const stats = [
        { label: "EQUIPMENT", value: equipment },
        { label: "DIFFICULTY", value: difficulty },
        { label: "SETS", value: sets },
        { label: "REPS", value: reps },
        {
            label: "DURATION",
            value:
                typeof duration === "number"
                    ? `${duration} min`
                    : duration,
        },
        {
            label: "CALORIES",
            value:
                typeof calories === "number"
                    ? `${calories} kcal`
                    : calories,
        },
        { label: "RATING", value: rating },
    ];

    return (<main className="min-h-screen bg-black px-6 py-12 text-white"> <div className="mx-auto max-w-7xl"> <Link
        href="/"
        className="mb-8 inline-flex text-sm font-bold text-lime-400 hover:text-lime-300"
    >
        ← BACK TO WORKOUTS </Link>


        {/* Workout Details */}
        <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Workout Image */}
            <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 md:min-h-96">
                {workout.image ? (
                    <Image
                        src={workout.image}
                        alt={name}
                        width={800}
                        height={600}
                        className="h-full max-h-[600px] w-full object-cover"
                    />

                ) : (
                    <span className="text-7xl" aria-hidden="true">
                        🏋️
                    </span>
                )}
            </div>

            {/* Workout Information */}
            <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-400">
                    {category}
                </p>

                <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                    {name}
                </h1>

                <p className="mt-6 leading-7 text-gray-400">
                    {description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    {[category, difficulty].map((item, index) => (
                        <span
                            key={`${item}-${index}`}
                            className="border border-lime-400/40 px-3 py-2 text-sm text-lime-400"
                        >
                            {item}
                        </span>
                    ))}
                </div>

                {/* About Workout Statistics */}

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="border border-white/10 bg-zinc-950 p-4"
                        >
                            <p className="text-xs font-bold tracking-wider text-gray-500">
                                {item.label}
                            </p>

                            <p className="mt-2 break-words font-bold text-white">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* About Workout Instructions */}

        <section className="mt-16">
            <p className="text-sm font-bold tracking-[0.3em] text-lime-400">
                YOUR WORKOUT
            </p>

            <h2 className="mt-3 text-3xl font-black">
                HOW TO PERFORM
            </h2>

            {instructions.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {instructions.map((step, index) => (
                        <div
                            key={index}
                            className="border border-white/10 bg-zinc-950 p-5"
                        >
                            <p className="font-bold text-lime-400">
                                STEP {index + 1}
                            </p>

                            <p className="mt-3 leading-7 text-gray-300">
                                {typeof step === "string"
                                    ? step
                                    : step.instruction ??
                                    step.description ??
                                    JSON.stringify(step)}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-5 text-gray-400">
                    Instructions are not available for this workout.
                </p>
            )}
        </section>
    </div>
    </main>


    );
}

export default function WorkoutDetailsPage() {
    return (
        <Suspense
            fallback={<main className="flex min-h-screen items-center justify-center bg-black text-white"> <div className="text-center"> <span className="loading loading-spinner loading-lg text-lime-400"></span> <p className="mt-4 text-gray-400">
                Loading workout details... </p> </div> </main>
            }
        > <WorkoutDetailsContent /> </Suspense>
    );
}
