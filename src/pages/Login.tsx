
import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Giriş Yap</h1>
          <p className="text-gray-600 mt-2">
            Hesabınıza giriş yaparak siparişlerinizi takip edebilirsiniz.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="block text-gray-700 font-medium">
                  Şifre
                </label>
                <Link to="/sifre-sifirlama" className="text-sm text-restaurant-700 hover:text-restaurant-800">
                  Şifremi unuttum
                </Link>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>

            <div className="text-center text-gray-600 text-sm">
              <p>
                Hesabınız yok mu?{" "}
                <Link to="/kayit" className="text-restaurant-700 font-medium hover:text-restaurant-800">
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-6 border-t pt-6">
            <p className="text-center text-gray-600 text-sm mb-4">
              Demo Kullanıcılar:
            </p>
            <div className="bg-gray-50 p-4 rounded-md text-sm">
              <p className="mb-2">
                <strong>Normal Kullanıcı:</strong> demo@example.com / demo123
              </p>
              <p>
                <strong>Admin:</strong> admin@example.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
