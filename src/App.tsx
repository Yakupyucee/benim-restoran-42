
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./hooks/use-cart";
import { useAuth } from "./hooks/use-auth";

// Sayfalar
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import MenuDetail from "./pages/MenuDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminMenu from "./pages/AdminMenu";
import AdminOrders from "./pages/AdminOrders";
import Order from "./pages/Order";

const queryClient = new QueryClient();

// Kullanıcı rolüne göre route koruma bileşeni
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: "admin" | "user" }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/giris" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/giris" element={<Login />} />
              <Route path="/kayit" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:foodId" element={<MenuDetail />} />
              <Route path="/sepet" element={<Cart />} />
              <Route path="/siparis" element={
                <ProtectedRoute>
                  <Order />
                </ProtectedRoute>
              } />
              <Route path="/profil" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/menu" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminMenu />
                </ProtectedRoute>
              } />
              <Route path="/admin/siparisler" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminOrders />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
