
import React from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-6xl font-bold text-restaurant-700 mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">Sayfa Bulunamadı</h1>
        <p className="text-gray-600 mb-8">
          Aradığınız sayfa bulunamadı. Sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
        </p>
        <Link to="/">
          <Button size="lg">Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
