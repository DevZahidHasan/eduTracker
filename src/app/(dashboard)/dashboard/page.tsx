export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="mb-6 text-4xl font-bold text-neon text-glow">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {['Total Students', 'Attendance Rate', 'Average Marks'].map((stat) => (
          <div
            key={stat}
            className="rounded-lg border border-cyan-800 bg-black/50 p-6 glow hover:border-neon transition-colors"
          >
            <h2 className="text-xl text-cyan-500">{stat}</h2>
            <p className="mt-4 text-3xl font-bold text-white text-glow">---</p>
          </div>
        ))}
      </div>
    </div>
  );
}
