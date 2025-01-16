// Updated AppLayout.tsx
import { Sidebar } from "@/app/dashboard/components/sidebar";
import { Navbar } from "@/app/dashboard/components/user-nav";
import { Footer } from "./footer";
import { useState, useEffect } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const hiddenPaths = ["/", "/signup", "/forgot-password"];
  const [isHidden, setIsHidden] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar toggle

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      setIsHidden(hiddenPaths.includes(pathname));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {!isHidden && (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <Navbar />
        </header>
      )}

      <div className="flex-1 flex flex-col">
        {/* Sidebar */}
        {!isHidden && (
          <>
            {/* Mobile Sidebar */}
            <div
              className={`fixed top-0 left-0 z-50 h-full w-64 bg-background transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform lg:hidden`}
            >
              <Sidebar />
              <button
                className="absolute top-4 right-4 text-gray-500 focus:outline-none"
                onClick={toggleSidebar}
              >
                ✕
              </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background">
              <Sidebar />
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 ${
            !isHidden ? "lg:ml-64" : ""
          } transition-all duration-300`}
        >
          <div className="container py-4 px-4 sm:px-6 lg:px-8 flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Content */}
            <div className="flex-1">{children}</div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
