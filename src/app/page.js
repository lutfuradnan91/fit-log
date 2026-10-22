import Image from "next/image";

import Link from "next/link";

export default function Home() {
return ( <main className="min-h-screen bg-black text-white">
{/* Hero Section */} 
<section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
{/* Hero Text */} 
<div> <p className="mb-5 text-sm font-bold tracking-[0.3em] text-lime-400">
WORKOUT LIBRARY </p>


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
        BROWSE WORKOUTS
        <span aria-hidden="true">→</span>
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

    <div className="border border-dashed border-white/20 p-10 text-center">
      <p className="text-gray-400">
        Workout library will appear here.
      </p>

      <p className="mt-2 text-sm text-gray-600">
        We will connect the FitLog API in the next step.
      </p>
    </div>
  </section>
</main>


);
}
