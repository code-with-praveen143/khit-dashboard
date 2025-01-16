"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bus, LayoutDashboard, UserCog, Wallet, Users, Banknote, Landmark, Settings } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/dashboard/user-management",
    icon: UserCog,
  },
  {
    title: "Onboarding Students",
    href: "/dashboard/fee-structure",
    icon: Wallet,
  },
  {
    title: "Bus Fee",
    href: "/dashboard/bus-fee",
    icon: Bus,
  },
  {
    title: "Student Profile",
    href: "/dashboard/student-management",
    icon: Users,
  },
  {
    title: "Payment History",
    href: "/dashboard/payment-history",
    icon: Banknote,
  },
  {
    title: "Current Batch",
    href: "/dashboard/current-batch",
    icon: Users,
  },
  {
    title: "Payment Gateway",
    href: "/dashboard/payment-gateway",
    icon: Landmark,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setTimeout(() => {
      setRole(storedRole);
    }, 500); // Simulate a delay for demonstration purposes
  }, []);

  const filteredNavItems = role
    ? sidebarNavItems.filter((item) => {
        if (role === "student") {
          return ["Dashboard", "Student Profile", "Payment Gateway", "Payment History"].includes(item.title);
        } else if (role === "admin") {
          return !["Student Profile", "Payment Gateway"].includes(item.title);
        } else if (role === "accountant") {
          return !["Student Profile", "Payment Gateway", "User Management"].includes(item.title);
        }
        return true; // Show all items for other roles or if role is not set
      })
    : [];
  const size = filteredNavItems?.length
  if (role === null) {
    // Display skeleton loader while role is being fetched
    return (
      <ScrollArea className="h-screen">
        <div className="space-y-4 py-8">
          <div className="px-3 py-2">
            <div className="space-y-2">
              {Array.from({ length: sidebarNavItems.length }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 bg-gray-300 rounded-md animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <div className="space-y-4 py-8">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive
                      ? "bg-secondary hover:bg-secondary/80"
                      : "hover:bg-secondary/10"
                  )}
                  asChild
                >
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
