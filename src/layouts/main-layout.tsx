
import React, { ReactNode } from "react";
import MainNavigation from "@/components/MainNavigation";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <main className="py-4 px-4 sm:px-6 lg:px-8">{children}</main>
      <footer className="bg-white shadow-inner mt-8 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 RestaurantApp. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
