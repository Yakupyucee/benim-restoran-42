import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalıdır");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Şifreler eşleşmiyor");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword) {
      validatePassword();
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (password) {
      validatePassword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword() || !acceptTerms) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await register(
        name,
        email,
        phone,
        password,
        confirmPassword
      );
      if (success) {
        navigate("/giris");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Kayıt Ol</h1>
          <p className="text-gray-600 mt-2">
            Yeni hesap oluşturarak sipariş vermeye hemen başlayın.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-700"
                placeholder="Ad Soyad"
                required
              />
            </div>

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
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-2"
              >
                Telefon Numarası
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-700"
                placeholder="+90 555 123 4567"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
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
                Şifre (Tekrar)
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-700 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
                required
              />
              {passwordError && (
                <p
                  data-testid="password-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {passwordError}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-restaurant-700 focus:ring-restaurant-700 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  <span>
                    <Link
                      to="/kullanim-kosullari"
                      className="text-restaurant-700 hover:text-restaurant-800"
                      target="_blank"
                    >
                      Kullanım Koşulları
                    </Link>{" "}
                    ve{" "}
                    <Link
                      to="/gizlilik-politikasi"
                      className="text-restaurant-700 hover:text-restaurant-800"
                      target="_blank"
                    >
                      Gizlilik Politikası
                    </Link>
                    'nı okudum ve kabul ediyorum.
                  </span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mb-4"
              disabled={isSubmitting || !acceptTerms}
            >
              {isSubmitting ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>

            <div className="text-center text-gray-600 text-sm">
              <p>
                Zaten hesabınız var mı?{" "}
                <Link
                  to="/giris"
                  className="text-restaurant-700 font-medium hover:text-restaurant-800"
                >
                  Giriş Yap
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
