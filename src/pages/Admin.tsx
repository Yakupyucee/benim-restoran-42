
import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Admin değilse yönlendir
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/giris" replace />;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-4">Menü Yönetimi</h2>
            <p className="text-gray-600 mb-4">Yeni ürünler ekleyin, mevcut ürünleri düzenleyin ve güncelleyin.</p>
            <Button onClick={() => navigate("/admin/menu")}>Menüyü Yönet</Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-4">Siparişler</h2>
            <p className="text-gray-600 mb-4">Gelen siparişleri görüntüleyin ve durumlarını güncelleyin.</p>
            <Button onClick={() => navigate("/admin/siparisler")}>Siparişleri Yönet</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
