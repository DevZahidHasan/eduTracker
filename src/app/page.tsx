import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <main className="flex max-w-3xl flex-col items-center justify-center gap-8 rounded-2xl border border-neon bg-black p-12 glow-strong">
        <h1 className="text-5xl font-extrabold tracking-tight text-neon text-glow sm:text-7xl">
          EduTracker
        </h1>
        <p className="max-w-xl text-lg text-cyan-100">
          The next-generation student management system. Track attendance, manage marks, and oversee
          your institution with a sleek, high-performance interface.
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-lg bg-neon px-8 py-3 font-bold text-black transition-all hover:bg-cyan-400 hover:glow-strong"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-neon bg-transparent px-8 py-3 font-bold text-neon transition-all hover:bg-neon/10 hover:glow"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/students" className="text-sm text-cyan-500 hover:text-neon hover:text-glow">
            → Students
          </Link>
          <Link
            href="/attendance"
            className="text-sm text-cyan-500 hover:text-neon hover:text-glow"
          >
            → Attendance
          </Link>
          <Link href="/marks" className="text-sm text-cyan-500 hover:text-neon hover:text-glow">
            → Marks
          </Link>
        </div>
      </main>
    </div>
  );
}
