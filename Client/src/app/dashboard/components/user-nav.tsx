"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  UserCog,
  CalendarRange,
  Bus,
  Users,
  Banknote,
  Landmark,
  Settings,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Menu } from "lucide-react";
import logo from "../../../utils/logo.png";

const allNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "User Management", href: "/dashboard/user-management", icon: UserCog },
  { title: "Onboarding Students", href: "/dashboard/fee-structure", icon: CalendarRange },
  { title: "Bus Fee", href: "/dashboard/bus-fee", icon: Bus },
  { title: "Student Profile", href: "/dashboard/student-management", icon: Users },
  { title: "Payment History", href: "/dashboard/payment-history", icon: Banknote },
  { title: "Current Batch", href: "/dashboard/current-batch", icon: Users },
  { title: "Payment Gateway", href: "/dashboard/payment-gateway", icon: Landmark },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    const storedEmail = sessionStorage.getItem("email");
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    router.push("/");
    sessionStorage.clear();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredNavItems = allNavItems; // Adjust this logic for role-based filtering

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center mx-auto relative">
          {/* Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-0 lg:transform-none lg:flex-1">
            <Image src={logo} alt="Logo" width={150} height={40} className="h-8 w-auto" />
          </div>

          {/* Right-side icons */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={username} />
                    <AvatarFallback>{getInitials(username)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                    <Settings className="h-6 w-6 pr-2" />Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-6 w-6 pr-2" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-background transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full py-6 px-4">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="self-end lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </Button>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-2 mt-4">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/10 ${
                  pathname === item.href ? "bg-secondary" : ""
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
