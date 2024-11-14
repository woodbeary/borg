export default function Loading() {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8 sm:mb-16">
        <div className="h-16 bg-gray-700 animate-pulse rounded-lg mb-4"></div>
        <div className="h-8 bg-gray-700 animate-pulse rounded-lg w-2/3 mx-auto"></div>
      </header>

      <section className="cyber-border p-4 sm:p-6 md:p-8 mb-8 sm:mb-16 max-w-4xl mx-auto">
        <div className="h-8 bg-gray-700 animate-pulse rounded-lg mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 bg-gray-700 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </section>
    </div>
  );
} 