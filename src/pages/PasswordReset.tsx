
import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "@/services/api";
import { toast } from "sonner";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setIsSubmitting(true);

    try {
      await authAPI.resetPassword({
        email,
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      });
      
      toast.success("Şifreniz başarıyla sıfırlandı! Giriş yapabilirsiniz.");
      navigate("/giris");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Şifre sıfırlama başarısız oldu. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Şifre Sıfırlama</h1>
          <p className="text-gray-600 mt-2">
            Şifrenizi sıfırlamak için gerekli bilgileri girin.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                E-posta
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-700"
                placeholder="ornek@gmail.com"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="oldPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Mevcut Şifre
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-700"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Yeni Şifre
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-700"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-700"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mb-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Şifre sıfırlanıyor..." : "Şifremi Sıfırla"}
            </Button>

            <div className="text-center text-gray-600 text-sm">
              <p>
                <Link to="/giris" className="text-restaurant-700 font-medium hover:text-restaurant-800">
                  Giriş sayfasına dön
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default PasswordReset;
