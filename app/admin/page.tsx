import { AdminPanel } from "@/app/components/AdminPanel";

export default function AdminPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold neon-text mb-4">
          Admin Panel
        </h1>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <AdminPanel />
      </main>
    </div>
  );
} 