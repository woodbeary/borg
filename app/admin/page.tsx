"use client";

import { useEffect, useState } from "react";
import { AdminPanel } from "@/app/components/AdminPanel";
import { AdminLogin } from "@/app/components/AdminLogin";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const adminToken = Cookies.get('adminToken');
    setIsAuthenticated(!!adminToken);
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    router.refresh();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="cyber-border p-6 animate-pulse">Loading...</div>
    </div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

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