export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-neon bg-black p-8 glow">
        <h1 className="mb-6 text-center text-3xl font-bold text-neon text-glow">
          EduTracker Login
        </h1>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="rounded border border-cyan-800 bg-transparent p-3 text-white placeholder-cyan-800 focus:border-neon focus:outline-none focus:glow"
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded border border-cyan-800 bg-transparent p-3 text-white placeholder-cyan-800 focus:border-neon focus:outline-none focus:glow"
          />
          <button className="mt-4 rounded bg-neon p-3 font-bold text-black hover:bg-cyan-400 hover:glow-strong transition-all">
            Enter System
          </button>
        </div>
      </div>
    </div>
  );
}
