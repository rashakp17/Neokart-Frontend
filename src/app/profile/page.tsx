"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, LogOut } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  _id: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem("heedy_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Not logged in, redirect to sign-in
      router.push("/sign-in");
    }
    setLoading(false);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("heedy_user");
    // Also might want to call backend logout to clear HTTP-only cookie if there's an endpoint
    // For now, clear local state and redirect
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!user) return null; // Will redirect

  // Extract initials for the avatar
  const initials = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-20 flex justify-center">
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row bg-white min-h-[calc(100vh-5rem)]">
        
        {/* ── Sidebar ── */}
        <aside className="w-full md:w-72 border-r border-slate-100 flex flex-col shrink-0">
          {/* User Profile Info */}
          <div className="p-8 flex flex-col items-center border-b border-slate-100">
            <div className="w-24 h-24 rounded-[32px] bg-blue-600 text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-lg shadow-blue-600/20">
              {initials}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              VIP
            </div>
            <h2 className="text-lg font-bold text-slate-900 text-center mb-1 line-clamp-1">
              {user.name}
            </h2>
            <p className="text-xs text-slate-500 text-center truncate w-full">
              {user.email}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-6 flex flex-col gap-2 flex-grow">
            <button className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20">
              <User size={18} />
              Overview
            </button>
            <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <Package size={18} />
              My Orders
            </button>
            <button className="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 font-medium text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <MapPin size={18} />
              Addresses
            </button>
          </nav>

          {/* Sign Out Button */}
          <div className="p-6 border-t border-slate-100">
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 p-8 md:p-12 lg:p-16 bg-[#F8F9FB]">
          <div className="max-w-3xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
              <h1 className="font-serif text-4xl md:text-5xl text-slate-900 leading-tight">
                Account <br />
                Overview
              </h1>
              <p className="text-base text-slate-500 max-w-sm md:text-right pt-2 leading-relaxed">
                Welcome back, {user.name.split(' ')[0]}. Here&apos;s what&apos;s happening with your account.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Total Orders Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  TOTAL ORDERS
                </p>
                <p className="font-sans font-bold text-4xl text-slate-900">
                  0
                </p>
              </div>

              {/* Heedy Points Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  HEEDY POINTS
                </p>
                <p className="font-sans font-bold text-4xl text-slate-900">
                  1,450
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-6">
                Recent Activity
              </p>
              <div className="text-sm text-slate-600">
                No recent orders found. Raw Response: []
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
