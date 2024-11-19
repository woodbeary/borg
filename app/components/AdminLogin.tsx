"use client";

import { useState } from "react";
import Cookies from 'js-cookie';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Check if password matches admin secret
      if (password === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
        // Set the admin token cookie with a 24-hour expiry
        Cookies.set('adminToken', process.env.NEXT_PUBLIC_ADMIN_SECRET, { 
          expires: 1, // 1 day
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        onLoginSuccess();
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="cyber-border p-8 max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center neon-text mb-8">
          Admin Login
        </h1>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-md text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-[var(--neon-pink)] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-[#1a1a2e] border-2 border-[var(--neon-blue)] rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full cyber-border p-4 text-center hover:scale-105 transition-transform bg-[var(--neon-purple)]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
} 